import * as fs from "fs/promises";
import { resolve, extname, dirname } from "path";

async function recursive_execute(directory: string, output_base: string, output_ext: string, input_base?: string): Promise<void> {
  const contents = await fs.readdir(directory, { withFileTypes: true, encoding: "utf8" });
  for (const entry of contents) {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory())
      return recursive_execute(path, output_base, output_ext, input_base ?? directory);
    if (input_base && extname(path) === ".ts") {
      const { generate } = await import(path);
      if (typeof generate !== "function")
        return console.warn(`${path} does not export a generate() function`);
      const output_path = `${output_base}${path.slice(input_base.length, -3)}${output_ext}`;
      await fs.mkdir(dirname(output_path), { recursive: true });
      let output = await generate();
      if (!output || typeof output !== "string")
        return console.warn(`${path} generate() did not return output`);
      fs.writeFile(output_path, output);
    }
  }
}

recursive_execute(__dirname, resolve(__dirname, "..", "data"), ".txt");
