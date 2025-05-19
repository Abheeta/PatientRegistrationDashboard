import { useEffect, useState } from 'react';
import { useDbActions } from '@/utils/useDbActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AlertCircle, Search } from 'lucide-react';
import { parse } from 'pgsql-ast-parser';

function isValidSelectQuery(sql: string): boolean {
  try {
    const ast = parse(sql);
    // Only allow SELECT queries
    return ast.length === 1 && ast[0].type === 'select';
  } catch (e) {
    return false;
  }
}

export function QueryPatient() {
  const [columnsQuery, setColumnsQuery] = useState('*');
  const [columnsQueryInput, setColumnsQueryInput] = useState('*');
  const [conditionQuery, setConditionQuery] = useState('');
  const [conditionQueryInput, setConditionQueryInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { useLivePatientsQuery } = useDbActions();

  const conditions = conditionQuery.trim() ? `${conditionQuery}` : '';

  const queryResults = useLivePatientsQuery(columnsQuery, conditions);

  useEffect(() => {
    if (queryResults === null) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [queryResults]);

  const executeQuery = () => {
    if (!isValidSelectQuery(`SELECT ${columnsQuery} FROM patients ${conditionQuery}`)) {
      setError('Invalid SQL query. Please check your syntax.');
      return;
    }

    setColumnsQuery(columnsQueryInput);
    setConditionQuery(conditionQueryInput);
    setIsExecuting(true);
    setError(null);
    setIsLoading(true);

    try {
      setTimeout(() => {
        setIsExecuting(false);
      }, 500);
    } catch (err) {
      setError('Error executing query. Please check your syntax.');
      setIsExecuting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Query Patients</h1>
        <p className="text-muted-foreground">
          Build and execute SQL queries to search for patients
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SQL Query Builder</CardTitle>
          <CardDescription>Construct your query using the fields below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col space-y-4 md:flex-row md:items-end md:space-x-2 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="bg-muted px-3 py-2 rounded-md text-sm font-medium">SELECT</div>
              <Input
                value={columnsQueryInput}
                onChange={(e) => setColumnsQueryInput(e.target.value)}
                className="min-w-[100px] md:w-[200px]"
                placeholder="*"
              />
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-muted px-3 py-2 rounded-md text-sm font-medium">FROM patients</div>
              <Input
                value={conditionQueryInput}
                onChange={(e) => setConditionQueryInput(e.target.value)}
                className="flex-1 min-w-[150px]"
                placeholder="WHERE age > 30"
              />
            </div>

            <Button onClick={executeQuery} disabled={isExecuting} className="md:ml-auto">
              <Search className="mr-2 h-4 w-4" />
              {isExecuting ? 'Executing...' : 'Execute Query'}
            </Button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="font-medium">Example queries:</p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>
                All patients: <code className="bg-muted px-1 rounded">*</code>
              </li>
              <li>
                Only names: <code className="bg-muted px-1 rounded">firstname, lastname</code>
              </li>
              <li>
                Filtering: <code className="bg-muted px-1 rounded">WHERE age {'>'} 30</code> or{' '}
                <code className="bg-muted px-1 rounded">WHERE gender = 'female'</code>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Query Results</CardTitle>
          <CardDescription>
            {queryResults?.rows.length
              ? `Found ${queryResults.rows.length} patient(s)`
              : 'No results found'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <span className="ml-3 text-muted-foreground">Loading data from PGlite...</span>
            </div>
          ) : queryResults && queryResults.rows.length > 0 ? (
            <div className="max-w-full overflow-x-auto max-h-[500px]">
              <div className="w-full min-w-max">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {queryResults.fields
                        .filter((field) => field.name !== '_id')
                        .map((field) => (
                          <TableHead key={field.name}>{field.name}</TableHead>
                        ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queryResults.rows.map((row) => (
                      <TableRow key={row._id as string}>
                        {queryResults.fields
                          .filter((field) => field.name !== '_id')
                          .map((field) => {
                            const value = row[field.name];
                            let displayValue = value;

                            // Format date values
                            if (field.name === 'dateofbirth' && typeof value === 'string') {
                              try {
                                displayValue = new Date(value).toLocaleDateString();
                              } catch (e) {
                                displayValue = value;
                              }
                            }

                            return (
                              <TableCell key={`${row._id}-${field.name}`}>
                                {displayValue === null || displayValue === undefined
                                  ? 'N/A'
                                  : String(displayValue)}
                              </TableCell>
                            );
                          })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {isExecuting
                ? 'Executing query...'
                : queryResults
                  ? 'No results found. Try adjusting your query.'
                  : 'Execute a query to see results'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
