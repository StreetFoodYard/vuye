import { Platform } from 'react-native';
import { ref, uploadBytesResumable, getDownloadURL, uploadString, deleteObject } from 'firebase/storage';
import { storage } from './firebaseConfig';

/**
 * Uploads a file to Firebase Storage
 * 
 * @param file The file to upload (Blob or File for web, URI for native)
 * @param path The path in storage where the file should be saved
 * @param metadata Optional metadata for the file
 * @param onProgress Optional progress callback
 * @returns Promise that resolves with the download URL
 */
export const uploadFile = async (
    file: Blob | string,
    path: string,
    metadata?: { contentType?: string;[key: string]: any },
    onProgress?: (progress: number) => void
): Promise<string> => {
    // Create storage reference
    const storageRef = ref(storage, path);

    let uploadTask;

    // Handle different platform file types
    if (Platform.OS === 'web') {
        // For web, file should be a Blob or File
        if (typeof file === 'string') {
            // If it's a data URL
            if (file.startsWith('data:')) {
                uploadTask = uploadString(storageRef, file, 'data_url', metadata);
            } else {
                throw new Error('Invalid file format for web platform');
            }
        } else {
            // It's a Blob or File
            uploadTask = uploadBytesResumable(storageRef, file, metadata);
        }
    } else {
        // For native platforms, convert URI to blob
        if (typeof file !== 'string') {
            throw new Error('File must be a URI string on native platforms');
        }

        // Fetch the file and convert to blob
        const response = await fetch(file);
        const blob = await response.blob();
        uploadTask = uploadBytesResumable(storageRef, blob, metadata);
    }

    // Return a promise that resolves with the download URL
    if (uploadTask.on) {
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Get upload progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) {
                        onProgress(progress);
                    }
                },
                (error) => {
                    // Handle errors
                    reject(error);
                },
                async () => {
                    // Upload completed successfully, get download URL
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    } else {
        // Handle uploadString which doesn't have .on method
        const snapshot = await uploadTask;
        return getDownloadURL(snapshot.ref);
    }
};

/**
 * Gets the download URL for a file in Firebase Storage
 * 
 * @param path The path to the file in storage
 * @returns Promise that resolves with the download URL
 */
export const getFileUrl = async (path: string): Promise<string> => {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
};

/**
 * Deletes a file from Firebase Storage
 * 
 * @param path The path to the file in storage
 * @returns Promise that resolves when the file is deleted
 */
export const deleteFile = async (path: string): Promise<void> => {
    const storageRef = ref(storage, path);
    return deleteObject(storageRef);
};

/**
 * Creates a unique file path for uploading
 * 
 * @param folder The folder to upload to
 * @param fileExtension The file extension (e.g., 'jpg', 'png')
 * @returns A unique path string
 */
export const createUniquePath = (folder: string, fileExtension: string): string => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    return `${folder}/${timestamp}-${randomString}.${fileExtension}`;
}; 