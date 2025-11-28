import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Calendar, IndianRupee, TrendingUp } from "lucide-react";

interface Project {
  id: string;
  name: string;
  location: string;
  budget: string;
  utilized: number;
  status: "ongoing" | "completed" | "delayed";
  startDate: string;
  endDate: string;
  description: string;
}

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: "PRJ-001",
      name: "Rural Road Development",
      location: "Gram Panchayat - Rampur",
      budget: "₹45,00,000",
      utilized: 72,
      status: "ongoing",
      startDate: "2024-01-01",
      endDate: "2024-06-30",
      description: "Construction of 5km rural road connecting 3 villages",
    },
    {
      id: "PRJ-002",
      name: "Primary School Building",
      location: "Gram Panchayat - Shivnagar",
      budget: "₹32,00,000",
      utilized: 45,
      status: "ongoing",
      startDate: "2024-02-01",
      endDate: "2024-08-31",
      description: "New 6-classroom school building with facilities",
    },
    {
      id: "PRJ-003",
      name: "Water Supply Pipeline",
      location: "Gram Panchayat - Madhubani",
      budget: "₹28,00,000",
      utilized: 100,
      status: "completed",
      startDate: "2023-10-01",
      endDate: "2024-01-15",
      description: "Underground water pipeline for 500 households",
    },
    {
      id: "PRJ-004",
      name: "Community Health Center",
      location: "Gram Panchayat - Patelnagar",
      budget: "₹55,00,000",
      utilized: 38,
      status: "delayed",
      startDate: "2023-12-01",
      endDate: "2024-07-31",
      description: "Multi-specialty health center with 24/7 facilities",
    },
    {
      id: "PRJ-005",
      name: "Solar Street Lighting",
      location: "Gram Panchayat - Greenfield",
      budget: "₹18,00,000",
      utilized: 89,
      status: "ongoing",
      startDate: "2024-01-15",
      endDate: "2024-04-30",
      description: "Installation of 200 solar street lights",
    },
    {
      id: "PRJ-006",
      name: "Drainage System Upgrade",
      location: "Gram Panchayat - Laxmipur",
      budget: "₹38,00,000",
      utilized: 100,
      status: "completed",
      startDate: "2023-09-01",
      endDate: "2023-12-31",
      description: "Modern drainage system covering entire panchayat area",
    },
  ];

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
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-heading font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Monitor all ongoing and completed development projects
            </p>
          </div>

          {/* Projects Grid */}
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
                    Budget: {project.budget}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {project.startDate} to {project.endDate}
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
                    {selectedProject.budget}
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
                <p className="mb-2 text-sm text-muted-foreground">Project Timeline</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {selectedProject.startDate} to {selectedProject.endDate}
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{selectedProject.description}</p>
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
