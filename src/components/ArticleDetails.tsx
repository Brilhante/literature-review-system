'use client';

import React from 'react';

interface ArticleDetailsProps {
    article: {
        university?: string;
        authors: string[];
        journal?: string;
        type?: string;
        mainKeywords?: string[];
        url?: string;
    } | null;
}

export const ArticleDetails: React.FC<ArticleDetailsProps> = ({ article }) => {
    if (!article) {
        return (
            <div className="p-8 text-center">
                <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <p className="text-gray-500 font-medium mb-1">Selecione um artigo</p>
                <p className="text-gray-400 text-sm">para ver mais detalhes</p>
            </div>
        );
    }

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-4 bg-white rounded-lg shadow-md">
                <div>
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Detalhes do Artigo</h3>
                        <p className="text-sm text-gray-500">Informações detalhadas sobre o artigo selecionado</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Universidade</h4>
                            <p className="text-gray-900 font-medium">{article.university || 'Não informado'}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Autores</h4>
                            <p className="text-gray-900 font-medium">{article.authors.length} autor(es)</p>
                            <div className="mt-2 space-y-1">
                                {article.authors.map((author, index) => (
                                    <p key={index} className="text-gray-600 text-sm">• {author}</p>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Revista</h4>
                            {article.journal ? (
                                <p className="text-gray-900 font-medium">{article.journal}</p>
                            ) : (
                                <p className="text-gray-500 italic">Não informado</p>
                            )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Tipo de Artigo</h4>
                            <p className="text-gray-900 font-medium">{article.type || 'Não informado'}</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Palavras-chave Principais</h4>
                            {article.mainKeywords && article.mainKeywords.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {article.mainKeywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">Não informado</p>
                            )}
                        </div>

                        {article.url && (
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">Link do Artigo</h4>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Acessar Artigo Completo
                                    <svg
                                        className="w-4 h-4 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
