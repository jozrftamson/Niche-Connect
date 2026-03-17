import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface AgentWorkflow {
  name: string;
  input: Record<string, string>;
  steps: Array<
    | { type: "filter"; field: "niche" | "account" | "hashtag" | "text"; operator?: "eq" | "includes"; value?: string; fromInput?: string }
    | { type: "sort"; by: "newest" | "most-engagement" }
    | { type: "limit"; value: number }
  >;
}

interface AgentPackage {
  id: string;
  title: string;
  description: string;
  workflow: AgentWorkflow;
}

interface WorkflowRunResponse {
  ok: boolean;
  workflow?: { name: string; steps: number };
  trace?: Array<{ step: number; type: string; count: number }>;
  result?: Array<{
    id: string;
    niche: string;
    sourceAccount: string;
    hashtags: string[];
    text: string;
    engagementScore: number;
    createdAt: string;
  }>;
  error?: string;
}

const EMPTY_WORKFLOW: AgentWorkflow = {
  name: "custom-agent-workflow",
  input: {
    niche: "webdev",
    hashtag: "react",
  },
  steps: [
    { type: "filter", field: "niche", operator: "eq", fromInput: "niche" },
    { type: "filter", field: "hashtag", operator: "includes", fromInput: "hashtag" },
    { type: "sort", by: "most-engagement" },
    { type: "limit", value: 20 },
  ],
};

export default function AgentsPage() {
  const { toast } = useToast();
  const [packages, setPackages] = useState<AgentPackage[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [workflowJson, setWorkflowJson] = useState(JSON.stringify(EMPTY_WORKFLOW, null, 2));
  const [packageTitle, setPackageTitle] = useState("Custom Package");
  const [packageDescription, setPackageDescription] = useState("Saved from Agent Studio");
  const [runResult, setRunResult] = useState<WorkflowRunResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const parsedWorkflow = useMemo(() => {
    try {
      return JSON.parse(workflowJson) as AgentWorkflow;
    } catch {
      return null;
    }
  }, [workflowJson]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/agents/packages");
        const payload = await res.json();
        const items = Array.isArray(payload?.packages) ? payload.packages : [];
        setPackages(items);
        if (items.length) {
          setSelectedId(items[0].id);
          setWorkflowJson(JSON.stringify(items[0].workflow, null, 2));
          setPackageTitle(items[0].title);
          setPackageDescription(items[0].description);
        }
      } catch {
        toast({
          title: "Packages konnten nicht geladen werden",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [toast]);

  const handleSelectPackage = (id: string) => {
    setSelectedId(id);
    const selected = packages.find((item: AgentPackage) => item.id === id);
    if (!selected) return;

    setWorkflowJson(JSON.stringify(selected.workflow, null, 2));
    setPackageTitle(selected.title);
    setPackageDescription(selected.description);
    setRunResult(null);
  };

  const handleRun = async () => {
    if (!parsedWorkflow) {
      toast({ title: "Workflow JSON ist ungueltig", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/agents/workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflow: parsedWorkflow }),
      });
      const payload = (await res.json()) as WorkflowRunResponse;
      setRunResult(payload);

      if (!res.ok || payload.ok === false) {
        toast({ title: payload.error ?? "Workflow fehlgeschlagen", variant: "destructive" });
        return;
      }

      toast({
        title: "Workflow ausgefuehrt",
        description: `${payload.result?.length ?? 0} Treffer`,
      });
    } catch {
      toast({ title: "Workflow konnte nicht ausgefuehrt werden", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePackage = async () => {
    if (!parsedWorkflow) {
      toast({ title: "Workflow JSON ist ungueltig", variant: "destructive" });
      return;
    }

    const slug = parsedWorkflow.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    if (!slug) {
      toast({ title: "Workflow-Name fehlt", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/agents/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          title: packageTitle.trim() || parsedWorkflow.name,
          description: packageDescription.trim() || "Saved workflow package",
          workflowJson: JSON.stringify(parsedWorkflow),
        }),
      });

      const payload = await res.json();
      if (!res.ok || payload?.ok === false) {
        toast({ title: payload?.error ?? "Speichern fehlgeschlagen", variant: "destructive" });
        return;
      }

      toast({ title: "Package gespeichert", description: `Slug: ${slug}` });

      const refresh = await fetch("/api/agents/packages");
      const refreshed = await refresh.json();
      const items = Array.isArray(refreshed?.packages) ? refreshed.packages : [];
      setPackages(items);
      setSelectedId(slug);
    } catch {
      toast({ title: "Package konnte nicht gespeichert werden", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-5">
      <Card className="p-5 space-y-2">
        <h1 className="text-2xl font-semibold">Agent Studio</h1>
        <p className="text-sm text-muted-foreground">
          JSON-basierter Workflow-Motor fuer Suche ueber Nischen, Accounts und Hashtags.
        </p>
      </Card>

      <Card className="p-5 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={selectedId}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => handleSelectPackage(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Package auswaehlen</option>
            {packages.map((item: AgentPackage) => (
              <option key={item.id} value={item.id}>
                {item.title} ({item.id})
              </option>
            ))}
          </select>

          <input
            value={packageTitle}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPackageTitle(e.target.value)}
            placeholder="Package Titel"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          />

          <input
            value={packageDescription}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPackageDescription(e.target.value)}
            placeholder="Package Beschreibung"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={handleRun} disabled={isLoading}>Workflow ausfuehren</Button>
          <Button variant="outline" onClick={handleSavePackage} disabled={isLoading}>Als Package speichern</Button>
          <Button
            variant="ghost"
            onClick={() => {
              setWorkflowJson(JSON.stringify(EMPTY_WORKFLOW, null, 2));
              setSelectedId("");
            }}
          >
            Reset Editor
          </Button>
        </div>
      </Card>

      <Card className="p-5 space-y-2">
        <p className="text-sm font-medium">Workflow JSON</p>
        <Textarea
          value={workflowJson}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setWorkflowJson(e.target.value)}
          className="min-h-[320px] font-mono text-xs"
        />
      </Card>

      <Card className="p-5 space-y-3">
        <p className="text-sm font-medium">Run Result</p>
        {!runResult && <p className="text-sm text-muted-foreground">Noch keine Ausfuehrung.</p>}

        {runResult && (
          <div className="space-y-3">
            <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
              {JSON.stringify(
                {
                  ok: runResult.ok,
                  workflow: runResult.workflow,
                  trace: runResult.trace,
                  count: runResult.result?.length ?? 0,
                },
                null,
                2,
              )}
            </pre>

            <div className="space-y-2">
              {(runResult.result ?? []).slice(0, 8).map((item: NonNullable<WorkflowRunResponse["result"]>[number]) => (
                <div key={item.id} className="p-3 rounded-md border">
                  <div className="text-xs text-muted-foreground">
                    {item.sourceAccount} | {item.niche} | score {item.engagementScore}
                  </div>
                  <p className="text-sm mt-1">{item.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">#{item.hashtags.join(" #")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
