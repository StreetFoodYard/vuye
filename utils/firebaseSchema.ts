import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDocs,
    getDoc,
    Timestamp,
    serverTimestamp,
    setDoc
} from 'firebase/firestore';
import { firestore } from './firebaseConfig';

// Collection names
export const COLLECTIONS = {
    USERS: 'users',
    TASKS: 'tasks',
    EVENTS: 'events',
    NOTES: 'notes',
    TAGS: 'tags',
    TASK_TAGS: 'taskTags',
    NOTE_TAGS: 'noteTags'
};

// TypeScript interfaces for the schema
export interface User {
    id?: string;
    displayName: string;
    email?: string;
    photoUrl?: string;
    createdAt: Timestamp | any; // Allow for server timestamp
}

export interface Task {
    id?: string;
    title: string;
    description?: string;
    dueDate: Date;
    priority: number;
    completed?: boolean;
    createdAt: Timestamp | any;
    userId: string; // Reference to User
}

export interface Event {
    id?: string;
    title: string;
    date: Date;
    time: string;
    location?: string;
    description?: string;
    createdAt: Timestamp | any;
    userId: string; // Reference to User
}

export interface Note {
    id?: string;
    date: Date;
    content: string;
    createdAt: Timestamp | any;
    userId: string; // Reference to User
}

export interface Tag {
    id?: string;
    name: string;
    createdAt: Timestamp | any;
    userId: string; // Reference to User
}

export interface TaskTag {
    id?: string;
    taskId: string;
    tagId: string;
    createdAt: Timestamp | any;
}

export interface NoteTag {
    id?: string;
    noteId: string;
    tagId: string;
    createdAt: Timestamp | any;
}

// User functions
export const createUser = async (user: Omit<User, 'createdAt'>): Promise<string> => {
    const userWithTimestamp = {
        ...user,
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(firestore, COLLECTIONS.USERS), userWithTimestamp);
    return docRef.id;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<void> => {
    const userRef = doc(firestore, COLLECTIONS.USERS, id);
    await updateDoc(userRef, user);
};

export const getUserById = async (id: string): Promise<User | null> => {
    const userRef = doc(firestore, COLLECTIONS.USERS, id);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        return null;
    }

    return { id: userDoc.id, ...userDoc.data() } as User;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const usersRef = collection(firestore, COLLECTIONS.USERS);
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as User;
};

// Task functions
export const createTask = async (task: Omit<Task, 'createdAt'>): Promise<string> => {
    const taskWithTimestamp = {
        ...task,
        createdAt: serverTimestamp(),
        completed: task.completed || false
    };

    const docRef = await addDoc(collection(firestore, COLLECTIONS.TASKS), taskWithTimestamp);
    return docRef.id;
};

export const updateTask = async (id: string, task: Partial<Task>): Promise<void> => {
    const taskRef = doc(firestore, COLLECTIONS.TASKS, id);
    await updateDoc(taskRef, task);
};

export const deleteTask = async (id: string): Promise<void> => {
    const taskRef = doc(firestore, COLLECTIONS.TASKS, id);
    await deleteDoc(taskRef);
};

export const getTaskById = async (id: string): Promise<Task | null> => {
    const taskRef = doc(firestore, COLLECTIONS.TASKS, id);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
        return null;
    }

    return { id: taskDoc.id, ...taskDoc.data() } as Task;
};

export const getTasksByUserId = async (userId: string): Promise<Task[]> => {
    const tasksRef = collection(firestore, COLLECTIONS.TASKS);
    const q = query(tasksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Task);
};

// Event functions
export const createEvent = async (event: Omit<Event, 'createdAt'>): Promise<string> => {
    const eventWithTimestamp = {
        ...event,
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(firestore, COLLECTIONS.EVENTS), eventWithTimestamp);
    return docRef.id;
};

export const updateEvent = async (id: string, event: Partial<Event>): Promise<void> => {
    const eventRef = doc(firestore, COLLECTIONS.EVENTS, id);
    await updateDoc(eventRef, event);
};

export const deleteEvent = async (id: string): Promise<void> => {
    const eventRef = doc(firestore, COLLECTIONS.EVENTS, id);
    await deleteDoc(eventRef);
};

export const getEventsByUserId = async (userId: string): Promise<Event[]> => {
    const eventsRef = collection(firestore, COLLECTIONS.EVENTS);
    const q = query(eventsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Event);
};

// Note functions
export const createNote = async (note: Omit<Note, 'createdAt'>): Promise<string> => {
    const noteWithTimestamp = {
        ...note,
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(firestore, COLLECTIONS.NOTES), noteWithTimestamp);
    return docRef.id;
};

export const updateNote = async (id: string, note: Partial<Note>): Promise<void> => {
    const noteRef = doc(firestore, COLLECTIONS.NOTES, id);
    await updateDoc(noteRef, note);
};

export const deleteNote = async (id: string): Promise<void> => {
    const noteRef = doc(firestore, COLLECTIONS.NOTES, id);
    await deleteDoc(noteRef);
};

export const getNotesByUserId = async (userId: string): Promise<Note[]> => {
    const notesRef = collection(firestore, COLLECTIONS.NOTES);
    const q = query(notesRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Note);
};

// Tag functions
export const createTag = async (tag: Omit<Tag, 'createdAt'>): Promise<string> => {
    const tagWithTimestamp = {
        ...tag,
        createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(firestore, COLLECTIONS.TAGS), tagWithTimestamp);
    return docRef.id;
};

export const getTagsByUserId = async (userId: string): Promise<Tag[]> => {
    const tagsRef = collection(firestore, COLLECTIONS.TAGS);
    const q = query(tagsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Tag);
};

// TaskTag functions
export const addTagToTask = async (taskId: string, tagId: string): Promise<string> => {
    const taskTag: Omit<TaskTag, 'createdAt' | 'id'> = {
        taskId,
        tagId
    };

    const docRef = await addDoc(collection(firestore, COLLECTIONS.TASK_TAGS), {
        ...taskTag,
        createdAt: serverTimestamp()
    });

    return docRef.id;
};

export const getTagsForTask = async (taskId: string): Promise<Tag[]> => {
    const taskTagsRef = collection(firestore, COLLECTIONS.TASK_TAGS);
    const q = query(taskTagsRef, where('taskId', '==', taskId));
    const querySnapshot = await getDocs(q);

    const tagIds = querySnapshot.docs.map(doc => doc.data().tagId);

    if (tagIds.length === 0) {
        return [];
    }

    const tags: Tag[] = [];

    for (const tagId of tagIds) {
        const tagRef = doc(firestore, COLLECTIONS.TAGS, tagId);
        const tagDoc = await getDoc(tagRef);

        if (tagDoc.exists()) {
            tags.push({ id: tagDoc.id, ...tagDoc.data() } as Tag);
        }
    }

    return tags;
};

// NoteTag functions
export const addTagToNote = async (noteId: string, tagId: string): Promise<string> => {
    const noteTag: Omit<NoteTag, 'createdAt' | 'id'> = {
        noteId,
        tagId
    };

    const docRef = await addDoc(collection(firestore, COLLECTIONS.NOTE_TAGS), {
        ...noteTag,
        createdAt: serverTimestamp()
    });

    return docRef.id;
};

export const getTagsForNote = async (noteId: string): Promise<Tag[]> => {
    const noteTagsRef = collection(firestore, COLLECTIONS.NOTE_TAGS);
    const q = query(noteTagsRef, where('noteId', '==', noteId));
    const querySnapshot = await getDocs(q);

    const tagIds = querySnapshot.docs.map(doc => doc.data().tagId);

    if (tagIds.length === 0) {
        return [];
    }

    const tags: Tag[] = [];

    for (const tagId of tagIds) {
        const tagRef = doc(firestore, COLLECTIONS.TAGS, tagId);
        const tagDoc = await getDoc(tagRef);

        if (tagDoc.exists()) {
            tags.push({ id: tagDoc.id, ...tagDoc.data() } as Tag);
        }
    }

    return tags;
}; 