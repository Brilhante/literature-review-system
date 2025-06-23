import { getFirestore, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { app } from '../firebase.config';

const db = getFirestore(app);

export const addArticle = async (article) => {
  try {
    const docRef = await addDoc(collection(db, 'articles'), {
      ...article,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar artigo:', error);
    throw error;
  }
};

export const getArticles = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'articles'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar artigos:', error);
    throw error;
  }
};

export const getArticlesByYear = async (year) => {
  try {
    const q = query(
      collection(db, 'articles'),
      where('year', '==', year)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar artigos por ano:', error);
    throw error;
  }
};

export const getArticlesByAuthor = async (author) => {
  try {
    const q = query(
      collection(db, 'articles'),
      where('authors', 'array-contains', author)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Erro ao buscar artigos por autor:', error);
    throw error;
  }
}; 