import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Calendar, IndianRupee, Plus, Loader2 } from "lucide-react";

interface Project {
  id: number;
  name: string;
  location: string;
  budget: number;
  utilized: number;
  status: "ongoing" | "completed" | "delayed";
}

const Projects = () => {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form state
  const [projectName, setProjectName] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectBudget, setProjectBudget] = useState("");

  // Fetch projects from backend
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/projects/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!projectName || !projectLocation || !projectBudget) {
      toast({
        title: "Missing Information",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("http://localhost:8000/projects/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: projectName,
          location: projectLocation,
          budget: parseFloat(projectBudget),
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project created successfully",
        });
        
        // Reset form
        setProjectName("");
        setProjectLocation("");
        setProjectBudget("");
        setShowCreateForm(false);
        
        // Refresh projects list
        fetchProjects();
      } else {
        throw new Error("Failed to create project");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success-light text-success border-success/20";
      case "ongoing":
        return "bg-primary/10 text-primary border-primary/20";
      case "delayed":
        return "bg-danger-light text-danger border-danger/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar />

      <div className="flex-1">
        <Navbar isLoggedIn userRole="admin" />

        <main className="p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-heading font-bold">Projects</h1>
              <p className="text-muted-foreground">
                Monitor all ongoing and completed development projects
              </p>
            </div>
            <Button onClick={() => setShowCreateForm(true)} size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </div>

          {/* Create Project Form */}
          {showCreateForm && (
            <Card className="mb-6 p-6">
              <h3 className="mb-4 text-lg font-heading font-semibold">
                Create New Project
              </h3>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Project Name</Label>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Rural Road Development"
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    value={projectLocation}
                    onChange={(e) => setProjectLocation(e.target.value)}
                    placeholder="Gram Panchayat - Village Name"
                  />
                </div>
                <div>
                  <Label>Budget (₹)</Label>
                  <Input
                    type="number"
                    value={projectBudget}
                    onChange={(e) => setProjectBudget(e.target.value)}
                    placeholder="4500000"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <Button onClick={handleCreateProject} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Project"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setProjectName("");
                    setProjectLocation("");
                    setProjectBudget("");
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Projects Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : projects.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">No projects found. Create your first project!</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
              <Card key={project.id} className="p-6 hover-lift">
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="font-heading font-semibold leading-tight">
                    {project.name}
                  </h3>
                  <Badge className={`${getStatusColor(project.status)} border`}>
                    {project.status}
                  </Badge>
                </div>

                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {project.location}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IndianRupee className="h-4 w-4" />
                    Budget: ₹{project.budget.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Utilization</span>
                    <span className="font-medium">{project.utilized}%</span>
                  </div>
                  <Progress value={project.utilized} className="h-2" />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedProject(project)}
                >
                  View Details
                </Button>
              </Card>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Project Details Modal */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">
              {selectedProject?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-6">
              <div>
                <Badge className={`${getStatusColor(selectedProject.status)} border`}>
                  {selectedProject.status}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedProject.location}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Project ID</p>
                  <p className="font-medium">{selectedProject.id}</p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Total Budget</p>
                  <p className="text-lg font-heading font-bold">
                    ₹{selectedProject.budget.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-muted-foreground">Funds Utilized</p>
                  <p className="text-lg font-heading font-bold text-success">
                    {selectedProject.utilized}%
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-muted-foreground">Fund Utilization</p>
                <Progress value={selectedProject.utilized} className="h-3" />
              </div>

              <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 md:grid-cols-3">
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-success">
                    12
                  </p>
                  <p className="text-xs text-muted-foreground">Approved Bills</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-warning">3</p>
                  <p className="text-xs text-muted-foreground">Pending Bills</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-heading font-bold text-danger">1</p>
                  <p className="text-xs text-muted-foreground">Rejected Bills</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
