declare module 'zip-dir' {
  /**
   * Zip a directory
   * @param directory - Path to the directory to zip
   * @param options - Zip options
   * @param callback - Callback function
   */
  function zipdir(
    directory: string, 
    options?: { 
      saveTo?: string;          
      filter?: (path: string, stat: any) => boolean; 
      each?: (file: string) => void; 
    }, 
    callback?: (err: Error | null, buffer?: Buffer) => void
  ): void;
  
  export = zipdir;
}