import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import FileUploader from '../components/molecules/FileUploader';
import { createUser, getUserByEmail, User } from '../utils/firebaseSchema';
import { auth } from '../utils/firebaseConfig';

interface UploadedFile {
    url: string;
    path: string;
    timestamp: number;
}

const FileUploadDemoScreen: React.FC = () => {
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const navigation = useNavigation();

    useEffect(() => {
        const checkUser = async () => {
            setLoading(true);
            try {
                // For demo purposes, create or fetch a test user
                const testEmail = 'test@example.com';
                let existingUser = await getUserByEmail(testEmail);

                if (!existingUser) {
                    const userId = await createUser({
                        displayName: 'Test User',
                        email: testEmail,
                        photoUrl: null
                    });

                    existingUser = {
                        id: userId,
                        displayName: 'Test User',
                        email: testEmail,
                        createdAt: new Date()
                    };
                }

                setUser(existingUser);
            } catch (error) {
                console.error('Error setting up user:', error);
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    const handleFileUploaded = (url: string, path: string) => {
        const newFile: UploadedFile = {
            url,
            path,
            timestamp: Date.now()
        };

        setUploadedFiles(prev => [newFile, ...prev]);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066CC" />
                <Text style={styles.loadingText}>Setting up demo...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Firebase Storage Demo</Text>
                <Text style={styles.subtitle}>Upload and manage files</Text>
            </View>

            <View style={styles.userContainer}>
                <Text style={styles.userTitle}>Current User:</Text>
                {user ? (
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user.displayName}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                ) : (
                    <Text style={styles.noUser}>No user available</Text>
                )}
            </View>

            <View style={styles.uploaderContainer}>
                <Text style={styles.sectionTitle}>Upload Files</Text>
                <FileUploader
                    onUploadComplete={handleFileUploaded}
                    folder={`users/${user?.id || 'unknown'}/images`}
                />
            </View>

            <View style={styles.filesContainer}>
                <Text style={styles.sectionTitle}>Uploaded Files</Text>

                {uploadedFiles.length === 0 ? (
                    <Text style={styles.noFiles}>No files uploaded yet</Text>
                ) : (
                    <FlatList
                        data={uploadedFiles}
                        keyExtractor={(item) => item.timestamp.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.fileItem}>
                                <Ionicons name="document" size={24} color="#0066CC" />
                                <View style={styles.fileInfo}>
                                    <Text style={styles.fileName}>
                                        {item.path.split('/').pop()}
                                    </Text>
                                    <Text style={styles.fileTimestamp}>
                                        {new Date(item.timestamp).toLocaleString()}
                                    </Text>
                                </View>
                            </View>
                        )}
                        style={styles.filesList}
                    />
                )}
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.infoTitle}>Firebase Integration</Text>
                <Text style={styles.infoText}>
                    This demo shows how to upload files to Firebase Storage and store references in Firestore.
                    Files are organized by user folders to maintain proper security and organization.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#333',
    },
    header: {
        padding: 16,
        backgroundColor: '#0066CC',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.8,
    },
    userContainer: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    userTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    userInfo: {
        flexDirection: 'column',
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    noUser: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
    uploaderContainer: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    filesContainer: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    noFiles: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
        textAlign: 'center',
        padding: 16,
    },
    filesList: {
        maxHeight: 300,
    },
    fileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    fileInfo: {
        marginLeft: 12,
        flex: 1,
    },
    fileName: {
        fontSize: 16,
        fontWeight: '500',
    },
    fileTimestamp: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    infoContainer: {
        backgroundColor: '#fff',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 32,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
});

export default FileUploadDemoScreen; 