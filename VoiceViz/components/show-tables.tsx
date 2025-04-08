import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  type: z.string().min(1, { message: "Please select a database type." }),
  host: z.string().min(1, { message: "Host is required." }),
  port: z.string().optional(),
  database: z.string().min(1, { message: "Database name is required." }),
  username: z.string().optional(),
  password: z.string().optional(),
});

export function ShowTable() {
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query] = useState("SHOW Tables;");
  const [queryPostgres] = useState("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';");

  const dbConnection = JSON.parse(localStorage.getItem("dbConnection") || "{}");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: dbConnection.type || "",
      host: dbConnection.host || "",
      port: dbConnection.port || "",
      database: dbConnection.database || "",
      username: dbConnection.username || "",
      password: dbConnection.password || "",
    },
  });

  const onConnect = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/database/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        setIsConnected(true);
        toast({
          title: "Connection successful",
          description: "Your database has been connected successfully.",
        });

        localStorage.setItem("dbConnection", JSON.stringify(values));
        return true;
      } else {
        toast({
          title: "Connection failed",
          description: data.error || "Failed to connect to database.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Connection error",
        description: "An error occurred while connecting to the database.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const ExecuteShow = async () => {
    if (!query.trim()) {
      setError("Please enter a query first.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const dbConnection = JSON.parse(localStorage.getItem("dbConnection") || "{}");

      if (!dbConnection?.type || !dbConnection?.host) {
        setError("Missing DB connection details.");
        return;
      }

      const bodyPayload = {
        ...dbConnection,
        query: dbConnection.type?.toLowerCase() === "mysql" ? query : queryPostgres,
      };

      const response = await fetch("/api/database/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      const data = await response.json();

      if (response.ok) {
        toast({ title: "Query executed", description: "Successfully fetched data." });
        const stringified = JSON.stringify(data, null, 2);
        setRawResponse(stringified);
        localStorage.setItem("rawResponse", stringified);
      } else {
        setError(data.error || "Failed to execute query.");
      }
    } catch (err) {
      setError("Error executing query. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  const handleManualLoad = async () => {
    setIsLoading(true);
    const success = await onConnect(form.getValues());
    if (success) {
      await ExecuteShow();
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-border/50 h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Show Tables</CardTitle>
        <Button onClick={handleManualLoad} disabled={isLoading || isSubmitting || isProcessing}>
          {isLoading || isSubmitting || isProcessing ? "Loading..." : "Load Tables"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] overflow-auto border p-2 bg-gray-900">
          {isLoading || isSubmitting || isProcessing ? (
            <div className="flex items-center justify-center h-full">
              <div className="h-6 w-6 animate-spin text-white">
                <Loader />
              </div>
            </div>
          ) : rawResponse ? (
            <pre className="text-sm text-white whitespace-pre-wrap">
              {rawResponse}
            </pre>
          ) : (
            <p className="text-sm text-gray-500">No data available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
