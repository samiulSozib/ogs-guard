'use client'
import { useState } from "react"
import { X, Camera, Upload, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Textarea } from "../ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

interface AddReportProps {
  trigger?: React.ReactNode
}

export function AddReport({ trigger }: AddReportProps) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const newImages = [...images, ...newFiles]
    setImages(newImages)

    // Create previews
    const newPreviews = newImages.map(file => URL.createObjectURL(file))
    setImagePreviews(newPreviews)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index])
    
    setImages(newImages)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = () => {
    // Here you would typically handle the submission
    // For example, upload images and note to your backend
    
    console.log("Submitting report:", { note, images })
    
    // Reset form and close dialog
    resetForm()
    setOpen(false)
  }

  const resetForm = () => {
    setNote("")
    setImages([])
    imagePreviews.forEach(url => URL.revokeObjectURL(url))
    setImagePreviews([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-[#5F0015] text-white font-bold hover:bg-[#5F0015]/90">
            <Camera className="mr-2 h-4 w-4" />
            Add New Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Upload Options */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Open Camera Button */}
              <Button
                variant="outline"
                className="h-24 flex-col gap-2 border-2 border-dashed border-gray-300 hover:border-gray-400"
                onClick={() => {
                  // Handle camera access
                  alert("Camera functionality would open here")
                }}
              >
                <Camera className="h-6 w-6 text-gray-600" />
                <span className="text-sm font-medium">Open Camera</span>
              </Button>

              {/* Upload Photo Button */}
              <label className="flex h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400">
                <Upload className="h-6 w-6 text-gray-600" />
                <span className="text-sm font-medium">Upload photo</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium text-gray-700">Uploaded Photos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-20 w-full rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {imagePreviews.length < 6 && (
                    <label className="flex h-20 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Note Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Note (Optional)
            </label>
            <Textarea
              placeholder="Add a note about the report..."
              value={note}
            //   onChange={(e) => setNote(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-start gap-3">
            <Button
              onClick={handleSubmit}
              className="bg-[#131842] text-white hover:bg-[#5F0015]/90"
              disabled={images.length === 0 && !note.trim()}
            >
              Upload to Report
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}