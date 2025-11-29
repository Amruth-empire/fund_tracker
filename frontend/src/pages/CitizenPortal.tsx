import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  IndianRupee,
  TrendingUp,
  Shield,
  Download,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Project {
  id: number;
  name: string;
  location: string;
  budget: number;
  utilized: number;
  status: string;
}

const CitizenPortal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const projectData = [
    { month: "Jan", allocated: 40, utilized: 35 },
    { month: "Feb", allocated: 45, utilized: 38 },
    { month: "Mar", allocated: 50, utilized: 42 },
    { month: "Apr", allocated: 48, utilized: 45 },
    { month: "May", allocated: 55, utilized: 48 },
    { month: "Jun", allocated: 52, utilized: 50 },
  ];

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8000/projects/");
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

    fetchProjects();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredProjects([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        project.status.toLowerCase().includes(query)
    );
    setFilteredProjects(results);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const displayProjects = filteredProjects.length > 0 ? filteredProjects : projects;

  const handleDownloadReport = () => {
    // Create CSV content for fund allocation vs utilization
    const csvContent = [
      ["Month", "Allocated (₹L)", "Utilized (₹L)"],
      ...projectData.map(row => [row.month, row.allocated, row.utilized])
    ].map(row => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fund-allocation-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadAllReports = () => {
    // Create comprehensive CSV with all project details
    const csvContent = [
      ["Project Name", "Location", "Allocated", "Utilized", "Progress %", "Status", "AI Verified"],
      ...projects.map(project => [
        project.name,
        project.location,
        project.allocated,
        project.utilized,
        project.progress,
        project.status,
        project.aiVerified ? "Yes" : "No"
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all-projects-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-primary py-16 text-white">
        <div className="container mx-auto px-6 text-center">
          <Shield className="mx-auto mb-4 h-16 w-16" />
          <h1 className="mb-4 text-4xl font-heading font-bold">
            Citizen Transparency Portal
          </h1>
          <p className="mb-8 text-lg opacity-90">
            Track development projects and fund utilization in your area with complete transparency
          </p>
          <div className="mx-auto max-w-2xl">
            <div className="flex gap-2">
              <Input
                placeholder="Search for projects in your panchayat..."
                className="bg-white text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button 
                variant="secondary" 
                size="lg"
                onClick={handleSearch}
              >
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
            {searchQuery && filteredProjects.length === 0 && (
              <p className="mt-4 text-sm text-white/80">
                No projects found matching "{searchQuery}"
              </p>
            )}
          </div>
        </div>
      </section>

      <main className="container mx-auto p-8">
        {/* Stats Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card className="p-6 text-center">
            <IndianRupee className="mx-auto mb-2 h-8 w-8 text-primary" />
            <div className="mb-1 text-3xl font-heading font-bold text-primary">
              ₹2.4 Cr
            </div>
            <div className="text-sm text-muted-foreground">Total Allocated</div>
          </Card>
          <Card className="p-6 text-center">
            <TrendingUp className="mx-auto mb-2 h-8 w-8 text-secondary" />
            <div className="mb-1 text-3xl font-heading font-bold text-secondary">
              ₹1.8 Cr
            </div>
            <div className="text-sm text-muted-foreground">Funds Utilized</div>
          </Card>
          <Card className="p-6 text-center">
            <CheckCircle className="mx-auto mb-2 h-8 w-8 text-success" />
            <div className="mb-1 text-3xl font-heading font-bold text-success">
              156
            </div>
            <div className="text-sm text-muted-foreground">Active Projects</div>
          </Card>
          <Card className="p-6 text-center">
            <Shield className="mx-auto mb-2 h-8 w-8 text-accent" />
            <div className="mb-1 text-3xl font-heading font-bold text-accent">
              98.5%
            </div>
            <div className="text-sm text-muted-foreground">AI Verified</div>
          </Card>
        </div>

        {/* Fund Usage Chart */}
        <Card className="mb-8 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold">
              Fund Allocation vs Utilization
            </h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownloadReport}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="allocated" fill="hsl(210, 100%, 42%)" name="Allocated (₹L)" />
              <Bar dataKey="utilized" fill="hsl(145, 70%, 45%)" name="Utilized (₹L)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Projects List */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold">
              {searchQuery 
                ? `Search Results (${displayProjects.length})`
                : "Active Development Projects"
              }
            </h2>
            {searchQuery && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setFilteredProjects([]);
                }}
              >
                Clear Search
              </Button>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : displayProjects.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? `No projects found matching "${searchQuery}"` : "No projects available"}
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {displayProjects.map((project) => (
                <Card key={project.id} className="p-6 hover-lift">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-xl font-heading font-semibold">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {project.location}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        className={
                          project.status === "completed"
                            ? "bg-success-light text-success"
                            : project.status === "ongoing"
                            ? "bg-primary/10 text-primary"
                            : "bg-danger-light text-danger"
                        }
                      >
                        {project.status}
                      </Badge>
                      <Badge className="bg-accent/10 text-accent">
                        <Shield className="mr-1 h-3 w-3" />
                        AI Verified
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">
                        Funds Allocated
                      </p>
                      <p className="text-lg font-heading font-bold">
                        ₹{project.budget.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">
                        Funds Utilized
                      </p>
                      <p className="text-lg font-heading font-bold text-success">
                        ₹{((project.budget * project.utilized) / 100).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">
                        Progress
                      </p>
                      <p className="text-lg font-heading font-bold">
                        {project.utilized}%
                      </p>
                    </div>
                  </div>

                  <div>
                    <Progress value={project.utilized} className="h-2" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Download Section */}
        <Card className="gradient-secondary p-8 text-center text-white">
          <Download className="mx-auto mb-4 h-12 w-12" />
          <h3 className="mb-2 text-2xl font-heading font-bold">
            Download Public Reports
          </h3>
          <p className="mb-6 opacity-90">
            Access detailed reports on fund utilization and project progress
          </p>
          <Button 
            variant="secondary" 
            size="lg"
            onClick={handleDownloadAllReports}
          >
            Download All Reports
          </Button>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            This portal ensures complete transparency in Panchayat fund management
          </p>
          <p>
            Powered by AI-based fraud detection and automated verification systems
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CitizenPortal;
