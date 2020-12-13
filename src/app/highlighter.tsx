import React, { FC } from 'react'
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter'
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript'
import 'highlight.js/styles/github.css'

SyntaxHighlighter.registerLanguage('js', js)

export const Highlighter: FC = ({ children }) => {
  return <SyntaxHighlighter language="js">{children}</SyntaxHighlighter>
}
