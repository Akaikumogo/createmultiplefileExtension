const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
  let disposable = vscode.commands.registerCommand(
    "extension.createmultiplefile",
    async () => {
      try {
        // Prompt user for file names separated by commas
        const input = await vscode.window.showInputBox({
          prompt: "Enter file names separated by comma",
          placeHolder: "file1, file2, file3",
        });

        if (!input) {
          vscode.window.showInformationMessage("Operation cancelled.");
          return;
        }

        const fileNames = input.split(",").map((fileName) => fileName.trim());

        if (fileNames.length === 0) {
          vscode.window.showInformationMessage("No file names entered.");
          return;
        }

        // Get the workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
          vscode.window.showErrorMessage("No workspace opened.");
          return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath; // Assuming single-root workspace

        // Create files in the workspace folder
        const createdFiles = [];
        for (const fileName of fileNames) {
          const filePath = path.join(folderPath, fileName);
          try {
            fs.writeFileSync(filePath, ""); // Create an empty file
            createdFiles.push(fileName);
          } catch (error) {
            vscode.window.showErrorMessage(
              `Failed to create ${fileName}: ${error.message}`
            );
          }
        }

        if (createdFiles.length > 0) {
          vscode.window.showInformationMessage(
            `Created ${createdFiles.length} files: ${createdFiles.join(", ")}`
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
