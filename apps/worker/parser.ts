import { parseString } from "xml2js";

export class ArtifactProcessor {
  public currentArtifact: string;
  private onFileContent: (filePath: string, fileContent: string) => void;
  private onShellCommand: (shellCommand: string) => void;

  constructor(
    currentArtifact: string,
    onFileContent: (filePath: string, fileContent: string) => void,
    onShellCommand: (shellCommand: string) => void
  ) {
    this.currentArtifact = currentArtifact;
    this.onFileContent = onFileContent;
    this.onShellCommand = onShellCommand;
  }

  append(artifact: string) {
    this.currentArtifact += artifact;
  }

  parse() {
    // Debugging: Log the raw input
    console.log("Raw XML Artifact:", JSON.stringify(this.currentArtifact));

    // Validate input: Check for empty or malformed XML
    if (!this.currentArtifact || !this.currentArtifact.trim()) {
      console.error("Error: XML string is empty or undefined.");
      return;
    }

    // Sanitize: Remove unexpected characters like backticks (`)
    this.currentArtifact = this.currentArtifact.replace(/[`]/g, "").trim();

    // Validate if XML starts with '<' (a proper tag)
    if (!this.currentArtifact.startsWith("<")) {
      console.error("Error: XML does not start with a valid tag.");
      return;
    }

    // Parse XML
    parseString(
      this.currentArtifact,
      { trim: true, explicitArray: false },
      (err, result) => {
        if (err) {
          console.error("Error parsing XML:", err.message);
          return;
        }

        // Ensure expected XML structure exists
        if (!result?.boltArtifact?.boltAction) {
          console.error(
            "Error: Missing 'boltArtifact' or 'boltAction' in XML."
          );
          return;
        }

        // Extract actions
        const actions = Array.isArray(result.boltArtifact.boltAction)
          ? result.boltArtifact.boltAction
          : [result.boltArtifact.boltAction];

        // Process each action
        for (const action of actions) {
          if (action.$?.type === "shell") {
            this.onShellCommand(action._);
          } else if (action.$?.type === "file") {
            this.onFileContent(action.$.filePath, action._);
          }
        }

        // Clear processed artifacts
        this.currentArtifact = "";
      }
    );
  }
}
