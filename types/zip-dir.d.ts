declare module 'zip-dir' {
    import { Stats } from 'fs';
    /**
     * Zip a directory
     * @param directory - Path to the directory to zip
     * @param options - Zip options
     * @param callback - Callback function
     */
    export default function zipdir(
        directory: string, 
        options?: { 
        saveTo?: string;          
        filter?: (path: string, stat: Stats) => boolean; 
        each?: (file: string) => void; 
        }, 
        callback?: (err: Error | null, buffer?: Buffer) => void
    ): void;

    export function zipdir(
        directory: string,
        options?: {
        saveTo?: string;
        filter?: (path: string, stat: Stats) => boolean;
        each?: (file: string) => void;
        },
        callback?: (err: Error | null, buffer?: Buffer) => void
    ): Promise<Buffer> | void;
  
}