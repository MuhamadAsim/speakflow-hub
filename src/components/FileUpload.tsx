// import { useState, useRef } from "react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Upload, File, X, FileText, FileImage, AlertCircle } from "lucide-react";

// interface UploadedFile {
//   id: string;
//   name: string;
//   type: string;
//   size: number;
//   content?: string;
// }

// interface FileUploadProps {
//   uploadedFiles: UploadedFile[];
//   onFilesChange: (files: UploadedFile[]) => void;
// }

// export default function FileUpload({ uploadedFiles, onFilesChange }: FileUploadProps) {
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const supportedTypes = [
//     'text/plain',
//     'application/pdf',
//     'text/markdown',
//     'text/csv',
//     'application/json'
//   ];

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const getFileIcon = (type: string) => {
//     if (type.includes('pdf')) return <File className="w-5 h-5 text-red-500" />;
//     if (type.includes('image')) return <FileImage className="w-5 h-5 text-blue-500" />;
//     return <FileText className="w-5 h-5 text-green-500" />;
//   };

//   const processFile = async (file: File): Promise<UploadedFile> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
      
//       reader.onload = (e) => {
//         const content = e.target?.result as string;
//         resolve({
//           id: Date.now().toString() + Math.random().toString(36),
//           name: file.name,
//           type: file.type,
//           size: file.size,
//           content: content
//         });
//       };
      
//       reader.onerror = () => reject(new Error('Failed to read file'));
      
//       if (file.type.startsWith('text/') || file.type === 'application/json') {
//         reader.readAsText(file);
//       } else {
//         // For PDF and other files, we'll store the file reference
//         resolve({
//           id: Date.now().toString() + Math.random().toString(36),
//           name: file.name,
//           type: file.type,
//           size: file.size,
//           content: `[${file.type} file uploaded]`
//         });
//       }
//     });
//   };

//   const handleFileSelect = async (files: FileList) => {
//     setIsUploading(true);
//     const validFiles = Array.from(files).filter(file => 
//       supportedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024 // 10MB limit
//     );

//     try {
//       const processedFiles = await Promise.all(validFiles.map(processFile));
//       onFilesChange([...uploadedFiles, ...processedFiles]);
//     } catch (error) {
//       console.error('Error processing files:', error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(false);
//     if (e.dataTransfer.files) {
//       handleFileSelect(e.dataTransfer.files);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   };

//   const handleDragLeave = () => {
//     setIsDragOver(false);
//   };

//   const removeFile = (fileId: string) => {
//     onFilesChange(uploadedFiles.filter(file => file.id !== fileId));
//   };

//   return (
//     <Card className="p-6 space-y-6">
//       <div className="flex items-center space-x-3">
//         <Upload className="w-6 h-6 text-primary" />
//         <div>
//           <h3 className="text-xl font-semibold">Knowledge Base</h3>
//           <p className="text-sm text-muted-foreground">
//             Upload documents for the AI to reference during conversations
//           </p>
//         </div>
//       </div>

//       {/* Upload Area */}
//       <div
//         className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
//           isDragOver
//             ? "border-primary bg-primary/5"
//             : "border-border hover:border-primary/50"
//         }`}
//         onDrop={handleDrop}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//       >
//         <div className="space-y-4">
//           <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
//           <div>
//             <p className="text-lg font-medium">
//               Drop files here or click to browse
//             </p>
//             <p className="text-sm text-muted-foreground">
//               Supports PDF, TXT, MD, CSV, JSON files up to 10MB
//             </p>
//           </div>
//           <Button
//             variant="accent"
//             onClick={() => fileInputRef.current?.click()}
//             disabled={isUploading}
//           >
//             {isUploading ? "Uploading..." : "Choose Files"}
//           </Button>
//         </div>
        
//         <input
//           ref={fileInputRef}
//           type="file"
//           multiple
//           accept=".pdf,.txt,.md,.csv,.json"
//           onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
//           className="hidden"
//         />
//       </div>

//       {/* Uploaded Files */}
//       {uploadedFiles.length > 0 && (
//         <div className="space-y-3">
//           <h4 className="font-medium">Uploaded Files ({uploadedFiles.length})</h4>
//           <div className="grid gap-3">
//             {uploadedFiles.map((file) => (
//               <div
//                 key={file.id}
//                 className="flex items-center justify-between p-3 bg-muted rounded-lg"
//               >
//                 <div className="flex items-center space-x-3">
//                   {getFileIcon(file.type)}
//                   <div>
//                     <p className="font-medium text-sm">{file.name}</p>
//                     <p className="text-xs text-muted-foreground">
//                       {formatFileSize(file.size)}
//                     </p>
//                   </div>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => removeFile(file.id)}
//                 >
//                   <X className="w-4 h-4" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Info */}
//       <div className="flex items-start space-x-2 p-3 bg-accent/10 rounded-lg">
//         <AlertCircle className="w-4 h-4 text-accent mt-0.5" />
//         <div className="text-sm text-muted-foreground">
//           <p>The AI will use these documents to provide more accurate and contextual responses.</p>
//         </div>
//       </div>
//     </Card>
//   );
// }











import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, File, X, FileText, FileImage, AlertCircle } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export default function FileUpload() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE = "http://localhost:5000/api";
  const FILE_BASE = "http://localhost:5000"; // ✅ Needed to open file

  const fetchUploadedFile = async () => {
    try {
      const res = await fetch(`${API_BASE}/upload`);
      if (!res.ok) return;
      const data = await res.json();
      setUploadedFile(data.file || null);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUploadedFile();
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <File className="w-5 h-5 text-red-500" />;
    if (type.includes("image"))
      return <FileImage className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-green-500" />;
  };

  const uploadToBackend = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    return await res.json();
  };

  const handleFileSelect = async (files: FileList) => {
    const file = files[0];
    if (
      !file ||
      ![
        "text/plain",
        "application/pdf",
        "text/markdown",
        "text/csv",
        "application/json",
      ].includes(file.type) ||
      file.size > 10 * 1024 * 1024
    ) {
      alert("Invalid file. Only PDF, TXT, MD, CSV, JSON up to 10MB allowed.");
      return;
    }

    setIsUploading(true);
    try {
      await uploadToBackend(file);
      await fetchUploadedFile();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async () => {
    if (!uploadedFile) return;

    try {
      await fetch(`${API_BASE}/upload/${uploadedFile.name}`, {
        method: "DELETE",
      });
      await fetchUploadedFile();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <Upload className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-xl font-semibold">Knowledge Base</h3>
          <p className="text-sm text-muted-foreground">
            Upload one document for the AI to reference
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
        <p className="text-lg font-medium">
          {isUploading ? "Uploading..." : "Click or drop a file to upload"}
        </p>
        <p className="text-sm text-muted-foreground">
          Supports PDF, TXT, MD, CSV, JSON files up to 10MB
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.md,.csv,.json"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Uploaded File */}
      {uploadedFile && (
        <div className="p-3 bg-muted rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getFileIcon(uploadedFile.type)}
            <div>
              {/* ✅ Clickable file link */}
              <a
                href={`${FILE_BASE}${uploadedFile.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-sm text-blue-600 hover:underline"
              >
                {uploadedFile.name}
              </a>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(uploadedFile.size)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRemoveFile}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex items-start space-x-2 p-3 bg-accent/10 rounded-lg">
        <AlertCircle className="w-4 h-4 text-accent mt-0.5" />
        <div className="text-sm text-muted-foreground">
          The AI will use this file to provide better answers.
        </div>
      </div>
    </Card>
  );
}
