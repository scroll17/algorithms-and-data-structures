/// <reference types="react-scripts" />

declare module '*.sass' {
    const content: {[className: string]: string};
    export = content;
}