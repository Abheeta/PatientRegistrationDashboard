import { useState, useEffect } from 'react';
import { useDbActions, type Patient } from '@/utils/useDbActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRound, Users, AlertCircle, Trash2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function Dashboard() {
  const { useLivePatients } = useDbActions();
  const patientsData = useLivePatients();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (patientsData === null) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [patientsData]);

  const totalPatients = patientsData?.rows.length || 0;
  const malePatients = patientsData?.rows.filter((p) => p.gender === 'male').length || 0;
  const femalePatients = patientsData?.rows.filter((p) => p.gender === 'female').length || 0;
  const recentPatients = patientsData?.rows.slice(0, 5) || [];

  const ageGroups = {
    child: patientsData?.rows.filter((p) => p.age < 18).length || 0,
    adult: patientsData?.rows.filter((p) => p.age >= 18 && p.age < 65).length || 0,
    senior: patientsData?.rows.filter((p) => p.age >= 65).length || 0,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Patient Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">{totalPatients}</div>
                <p className="text-xs text-muted-foreground">Registered in the system</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gender Distribution</CardTitle>
            <UserRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
              </div>
            ) : (
              <div className="flex justify-between">
                <div>
                  <div className="text-2xl font-bold">{malePatients}</div>
                  <p className="text-xs text-muted-foreground">Male</p>
                </div>
                <div>
                  <div className="text-2xl font-bold">{femalePatients}</div>
                  <p className="text-xs text-muted-foreground">Female</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Age Groups</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-8 flex items-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <div className="text-xl font-bold">{ageGroups.child}</div>
                  <p className="text-xs text-muted-foreground">{'<18'}</p>
                </div>
                <div>
                  <div className="text-xl font-bold">{ageGroups.adult}</div>
                  <p className="text-xs text-muted-foreground">18-64</p>
                </div>
                <div>
                  <div className="text-xl font-bold">{ageGroups.senior}</div>
                  <p className="text-xs text-muted-foreground">65+</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList>
          <TabsTrigger value="recent">Recent Patients</TabsTrigger>
          <TabsTrigger value="all">All Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                Recently Registered Patients
                {isLoading && (
                  <div className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                )}
              </CardTitle>
              <CardDescription>The 5 most recently registered patients</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <span className="ml-3 text-muted-foreground">Loading patient data...</span>
                </div>
              ) : recentPatients.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {recentPatients.map((patient) => (
                    <PatientAccordionItem key={patient.id} patient={patient} />
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-4">No patients registered yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                All Patients
                {isLoading && (
                  <div className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                )}
              </CardTitle>
              <CardDescription>Complete list of registered patients</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
                  <span className="ml-3 text-muted-foreground">Loading patient data...</span>
                </div>
              ) : patientsData && patientsData.rows.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {patientsData.rows.map((patient) => (
                    <PatientAccordionItem key={patient.id} patient={patient} />
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-4">No patients registered yet</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PatientAccordionItem({ patient }: { patient: Patient }) {
  const { deletePatient } = useDbActions();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      setIsDeleting(true);
      await deletePatient(patient.id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting patient:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AccordionItem value={`patient-${patient.id}`} className="border px-4 rounded-md mb-2 w-full">
      <AccordionTrigger className="w-full py-4 cursor-pointer">
        <div className="flex items-center justify-between w-full pr-2">
          <div className="flex items-center gap-4">
            <div className="font-medium">{`${patient.firstname} ${patient.lastname}`}</div>
            <div className="text-sm text-muted-foreground hidden md:block">
              {patient.age} years • {patient.gender}
            </div>
            <div className="text-sm text-muted-foreground hidden lg:block">
              {patient.email || 'No email'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Patient Record</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete {patient.firstname} {patient.lastname}'s record?
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pb-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium">Personal Information</h4>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="text-sm">{new Date(patient.dateofbirth).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{patient.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm">{patient.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Medical Information</h4>
              <div className="grid grid-cols-1 gap-2 mt-1">
                <div>
                  <p className="text-xs text-muted-foreground">Medical History</p>
                  <p className="text-sm">{patient.medicalhistory || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Allergies</p>
                  <p className="text-sm">{patient.allergies || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium">Emergency Contact</h4>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm">{patient.emergencycontactname || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Number</p>
                  <p className="text-sm">{patient.emergencycontactnumber || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Insurance</h4>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className="text-xs text-muted-foreground">Provider</p>
                  <p className="text-sm">{patient.insuranceprovider || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Number</p>
                  <p className="text-sm">{patient.insurancenumber || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Registration</h4>
              <div className="grid grid-cols-1 gap-2 mt-1">
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm">
                    {patient.registrationdate
                      ? new Date(patient.registrationdate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>{' '}
    </AccordionItem>
  );
}
