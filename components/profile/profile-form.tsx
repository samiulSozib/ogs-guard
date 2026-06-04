// components/profile/profile-form-modal.tsx
'use client'

import { useState, useEffect } from "react"
import { Guard, GuardDocument } from "@/app/types/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, Save, UploadCloud, FileText, Trash2, Plus } from "lucide-react"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { DOCUMENT_TYPES } from "@/lib/validation/guard.types"
import SweetAlertService from "@/lib/sweetAlert"

interface ProfileFormModalProps {
  isOpen: boolean
  onClose: () => void
  guard: Guard | null
  user: { id: number; name: string | null; email: string; created_at: string } | null
  onSubmit: (data: FormData) => Promise<void>
  isUpdating: boolean
}

interface ExistingDocument {
  id: number;
  document_type: string;
  file_path: string;
  file_name: string;
  verification_status?: string;
}

export function ProfileFormModal({
  isOpen,
  onClose,
  guard,
  user,
  onSubmit,
  isUpdating
}: ProfileFormModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zip_code: '',
  })

  // Document states
  const [documents, setDocuments] = useState<File[]>([])
  const [existingDocuments, setExistingDocuments] = useState<ExistingDocument[]>([])
  const [documentsToDelete, setDocumentsToDelete] = useState<number[]>([])
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<string[]>([])
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [existingProfileImage, setExistingProfileImage] = useState<string>("")

  useEffect(() => {
    if (guard) {
      setFormData({
        full_name: guard.full_name || '',
        phone: guard.phone || '',
        email: guard.email || '',
        date_of_birth: guard.date_of_birth || '',
        gender: guard.gender || '',
        country: guard.country || '',
        state: guard.profile?.current_state || '',
        city: guard.city || '',
        address: guard.address || '',
        zip_code: guard.zip_code || '',
      })

      // Set existing profile image
      if (guard.profile_image_url) {
        setExistingProfileImage(guard.profile_image_url)
      }

      // Set existing documents
      if (guard.documents && guard.documents.length > 0) {
        const mappedDocs: ExistingDocument[] = guard.documents.map((doc: GuardDocument) => ({
          id: doc.id,
          document_type: doc.document_type,
          file_path: doc.file_path,
          file_name: doc.file_name,
          verification_status: doc.verification_status
        }))
        setExistingDocuments(mappedDocs)
        
        // Auto-select document types from existing documents
        const existingDocTypes = guard.documents
          .map((doc: GuardDocument) => doc.document_type)
          .filter((type): type is string => !!type)
        setSelectedDocumentTypes(existingDocTypes)
      }
    }
  }, [guard])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  // Profile image handlers
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        SweetAlertService.error("Invalid file type", "Please upload an image file")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        SweetAlertService.error("File too large", "Please upload an image smaller than 5MB")
        return
      }
      setProfileImage(file)
      setExistingProfileImage("")
    }
  }

  // Document handlers
  const handleDocumentUpload = (docTypeId: string, file: File) => {
    const validTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if (!validTypes.includes(file.type)) {
      SweetAlertService.error('Invalid File Type', 'Please upload PDF, JPG, PNG, or DOC files only')
      return false
    }

    if (file.size > 10 * 1024 * 1024) {
      SweetAlertService.error('File Too Large', 'Please upload a file smaller than 10MB')
      return false
    }

    const documentWithType = new File([file], `${docTypeId}-${file.name}`, { type: file.type })
    setDocuments(prev => [...prev, documentWithType])
    return true
  }

  const removeDocument = (index: number, isExisting: boolean = false, existingId?: number) => {
    if (isExisting && existingId) {
      setDocumentsToDelete(prev => [...prev, existingId])
      setExistingDocuments(prev => prev.filter(doc => doc.id !== existingId))
      // Remove from selected document types
      const docToRemove = existingDocuments.find(doc => doc.id === existingId)
      if (docToRemove) {
        setSelectedDocumentTypes(prev => prev.filter(type => type !== docToRemove.document_type))
      }
    } else {
      setDocuments(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleDocumentTypeChange = (docTypeId: string) => {
    const newSelectedTypes = selectedDocumentTypes.includes(docTypeId)
      ? selectedDocumentTypes.filter(type => type !== docTypeId)
      : [...selectedDocumentTypes, docTypeId]

    setSelectedDocumentTypes(newSelectedTypes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate file sizes
    if (profileImage && profileImage.size > 2 * 1024 * 1024) {
        await SweetAlertService.error(
            'File Too Large',
            'Profile image must be less than 2MB. Please compress your image and try again.'
        )
        return
    }

    const oversizedDocuments = documents.filter(doc => doc.size > 2 * 1024 * 1024)
    if (oversizedDocuments.length > 0) {
        const fileNames = oversizedDocuments.map(doc => doc.name).join(', ')
        await SweetAlertService.error(
            'Files Too Large',
            `The following document(s) exceed the 2MB limit:\n${fileNames}\n\nPlease compress these files and try again.`
        )
        return
    }
    
    const formDataToSend = new FormData()
    
    // Add basic info
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSend.append(key, value)
      }
    })

    // Profile image
    if (profileImage) {
      formDataToSend.append('profile_image', profileImage)
    } else if (existingProfileImage && !profileImage) {
      formDataToSend.append('keep_profile_image', '1')
    } else if (!existingProfileImage && !profileImage) {
      formDataToSend.append('remove_profile_image', '1')
    }

    // Document types
    if (selectedDocumentTypes.length > 0) {
      formDataToSend.append('document_types', JSON.stringify(selectedDocumentTypes))
    }

    // Documents to delete
    if (documentsToDelete.length > 0) {
      formDataToSend.append('delete_documents', JSON.stringify(documentsToDelete))
    }

    // New documents as indexed arrays
    const documentsToSend: Array<{ type: string; file: File; originalName: string }> = []
    
    documents.forEach((doc) => {
      const firstHyphenIndex = doc.name.indexOf('-')
      let documentType = ''
      let originalFileName = doc.name
      
      if (firstHyphenIndex > 0) {
        documentType = doc.name.substring(0, firstHyphenIndex)
        originalFileName = doc.name.substring(firstHyphenIndex + 1)
      } else {
        for (const docType of selectedDocumentTypes) {
          if (doc.name.toLowerCase().includes(docType.toLowerCase())) {
            documentType = docType
            originalFileName = doc.name
            break
          }
        }
      }
      
      if (documentType) {
        const cleanFile = new File([doc], originalFileName, { type: doc.type })
        documentsToSend.push({ type: documentType, file: cleanFile, originalName: originalFileName })
      } else {
        documentsToSend.push({ type: 'other', file: doc, originalName: doc.name })
      }
    })
    
    documentsToSend.forEach((doc, index) => {
      formDataToSend.append(`document_types[${index}]`, doc.type)
      formDataToSend.append(`documents[${index}]`, doc.file)
    })

    await onSubmit(formDataToSend)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0 dark:bg-gray-900">
        <SheetHeader className="p-4 border-b sticky top-0 bg-white dark:bg-gray-900 z-10 border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="dark:text-white">Edit Profile</SheetTitle>
              <SheetDescription className="dark:text-gray-400">Update your personal information and documents</SheetDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="shrink-0 dark:hover:bg-gray-800 dark:text-gray-400"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(90vh-73px)] p-4 dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="border rounded-xl p-4 border-gray-200 dark:border-gray-800">
              <Label className="text-sm font-medium mb-3 block dark:text-gray-300">Profile Photo</Label>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <input
                    type="file"
                    id="profileImage"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <label htmlFor="profileImage" className="cursor-pointer">
                    <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all overflow-hidden">
                      {(profileImage || existingProfileImage) ? (
                        <>
                          <Image
                            src={profileImage ? URL.createObjectURL(profileImage) : existingProfileImage}
                            alt="Profile preview"
                            width={128}
                            height={128}
                            className="rounded-full object-cover w-full h-full"
                            unoptimized={!!existingProfileImage}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Plus className="w-8 h-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 text-center px-2">
                            Upload Photo
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                {(profileImage || existingProfileImage) && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileImage(null);
                      setExistingProfileImage("");
                    }}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm flex items-center gap-1"
                  >
                    <X size={14} /> Remove Photo
                  </button>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
                  JPG, PNG, GIF. Max 5MB. Square image recommended.
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg dark:text-white">Basic Information</h3>
              
              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="text-sm font-medium dark:text-gray-300">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium dark:text-gray-300">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium dark:text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="date_of_birth" className="text-sm font-medium dark:text-gray-300">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-sm font-medium dark:text-gray-300">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                >
                  <SelectTrigger className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                    <SelectItem value="male" className="dark:text-white dark:focus:bg-gray-700">Male</SelectItem>
                    <SelectItem value="female" className="dark:text-white dark:focus:bg-gray-700">Female</SelectItem>
                    <SelectItem value="other" className="dark:text-white dark:focus:bg-gray-700">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-sm font-medium dark:text-gray-300">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-sm font-medium dark:text-gray-300">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-sm font-medium dark:text-gray-300">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zip_code" className="text-sm font-medium dark:text-gray-300">Zip Code</Label>
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    placeholder="Zip code"
                    className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-sm font-medium dark:text-gray-300">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Documents Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg dark:text-white">Documents</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DOCUMENT_TYPES.map((docType) => {
                  const isSelected = selectedDocumentTypes.includes(docType.id);
                  const hasExistingDoc = existingDocuments.some(doc => doc.document_type === docType.id);
                  const newDocumentIndex = documents.findIndex(doc => doc.name.startsWith(`${docType.id}-`));

                  return (
                    <div
                      key={docType.id}
                      className={`border rounded-xl p-4 transition-all ${
                        isSelected
                          ? 'border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id={`doc-${docType.id}`}
                          checked={isSelected}
                          onChange={() => handleDocumentTypeChange(docType.id)}
                          className="rounded w-4 h-4 text-blue-600 dark:text-blue-500 mt-1 flex-shrink-0 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label
                          htmlFor={`doc-${docType.id}`}
                          className="text-sm font-medium cursor-pointer flex-1 dark:text-gray-300"
                        >
                          {docType.name}
                        </label>
                      </div>

                      {isSelected && (
                        <div className="mt-4 ml-7">
                          {/* Existing Document */}
                          {hasExistingDoc && newDocumentIndex === -1 && (
                            <div className="mb-3">
                              {existingDocuments
                                .filter(doc => doc.document_type === docType.id)
                                .map((existingDoc) => (
                                  <div key={existingDoc.id} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <FileText size={16} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                                      <span className="text-sm text-green-700 dark:text-green-300 truncate" title={existingDoc.file_name}>
                                        {existingDoc.file_name}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeDocument(0, true, existingDoc.id)}
                                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all flex-shrink-0 ml-2"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                ))}
                            </div>
                          )}

                          {/* New Document Upload */}
                          {newDocumentIndex === -1 ? (
                            <div className="space-y-2">
                              <input
                                type="file"
                                id={`file-${docType.id}`}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleDocumentUpload(docType.id, file);
                                    e.target.value = '';
                                  }
                                }}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              />
                              <label htmlFor={`file-${docType.id}`} className="block w-full cursor-pointer">
                                <div className="border-2 border-dashed rounded-lg p-3 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all text-center border-gray-300 dark:border-gray-600">
                                  <UploadCloud className="w-5 h-5 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                                  <span className="text-xs text-gray-600 dark:text-gray-400 block">
                                    {hasExistingDoc ? 'Replace document' : 'Upload document'}
                                  </span>
                                </div>
                              </label>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <FileText size={16} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                <span className="text-sm dark:text-gray-300 truncate" title={documents[newDocumentIndex].name}>
                                  {documents[newDocumentIndex].name.replace(`${docType.id}-`, '')}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setDocuments(prev => prev.filter((_, i) => i !== newDocumentIndex))}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all flex-shrink-0"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Uploaded Documents Summary */}
            {(documents.length > 0 || existingDocuments.length > 0) && (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm flex items-center gap-2 dark:text-gray-300">
                    <FileText size={16} className="text-blue-500 dark:text-blue-400" />
                    Documents ({existingDocuments.length + documents.length})
                  </h4>
                  {documents.length > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setDocuments([])}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 h-7 text-xs"
                    >
                      Clear New
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {existingDocuments.map((doc) => (
                    <div key={`existing-${doc.id}`} className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 flex items-center justify-between border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText size={14} className="text-green-500 dark:text-green-400 flex-shrink-0" />
                        <span className="text-xs truncate text-green-700 dark:text-green-300" title={doc.file_name}>
                          {doc.file_name.length > 40 ? doc.file_name.substring(0, 40) + '...' : doc.file_name}
                        </span>
                        <span className="text-xs text-green-600 dark:text-green-400">(existing)</span>
                      </div>
                    </div>
                  ))}
                  {documents.map((doc, index) => (
                    <div key={`new-${index}`} className="bg-white dark:bg-gray-800 rounded-lg p-2 flex items-center justify-between border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FileText size={14} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
                        <span className="text-xs truncate dark:text-gray-300" title={doc.name}>
                          {doc.name.length > 40 ? doc.name.substring(0, 40) + '...' : doc.name}
                        </span>
                        <span className="text-xs text-blue-500 dark:text-blue-400">(new)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(index, false)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white dark:bg-gray-900 pb-4 border-t border-gray-200 dark:border-gray-800 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#5F0015] hover:bg-[#5F0015]/90 h-10 dark:bg-[#8B001F] dark:hover:bg-[#8B001F]/90"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}