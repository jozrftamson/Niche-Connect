import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { UploadCloud, FileText, Check } from "lucide-react";
import { useState } from "react";
import Papa from "papaparse";
import { useToast } from "@/hooks/use-toast";

export default function Import() {
  const { importTemplates } = useStore();
  const { toast } = useToast();
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        // Mock processing logic: assumes CSV has 'label' and 'content' columns
        const newTemplates = results.data
          .filter((row: any) => row.content && row.label)
          .map((row: any, i) => ({
            id: `imported-${Date.now()}-${i}`,
            label: row.label,
            content: row.content
          }));
        
        if (newTemplates.length > 0) {
          importTemplates(newTemplates);
          toast({
            title: "Import Successful",
            description: `Imported ${newTemplates.length} new templates.`,
          });
        } else {
          toast({
            title: "Import Failed",
            description: "Could not find 'label' and 'content' columns.",
            variant: "destructive"
          });
        }
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Import Templates</h1>
        <p className="text-muted-foreground">
          Upload a CSV file with your custom comment templates.
        </p>
      </div>

      <div className="bg-card border-2 border-dashed rounded-xl p-12 text-center transition-colors hover:bg-muted/10 relative">
        <input 
          type="file" 
          accept=".csv"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
          <UploadCloud size={32} />
        </div>
        <h3 className="text-xl font-semibold mb-2">Click to Upload CSV</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
          File should contain columns: <code>label</code>, <code>content</code>.
          <br/>
          Supported variables: <code>{`{creatorName}`}</code>, <code>{`{topic}`}</code>
        </p>
        
        <Button>Select File</Button>
      </div>

      <div className="mt-8 bg-blue-50 text-blue-900 p-4 rounded-lg flex gap-3 text-sm">
        <FileText className="shrink-0" size={20} />
        <div>
          <p className="font-semibold mb-1">Download Example Sheet</p>
          <p className="mb-2 opacity-80">Get started with our pre-formatted template sheet.</p>
          <a href="#" className="text-blue-700 underline font-medium hover:text-blue-800">
            Download template_example.csv
          </a>
        </div>
      </div>
    </div>
  );
}
