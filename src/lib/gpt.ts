// import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
// import Configuration from 'openai';
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources/index.mjs';

// Ensure you have your OpenAI API key set in your environment variables
const apiKey: string = process.env.OPENAI_API_KEY || '';

const openai = new OpenAI({ apiKey });

interface OutputFormat {
  [key: string]: string | string[] | OutputFormat;
}

export async function strict_output(
  system_prompt: string,
  user_prompt: string | string[],
  output_format: OutputFormat,
  default_category: string = "",
  output_value_only: boolean = false,
  model: string = "gpt-4o-mini",
  temperature: number = 1,
  num_tries: number = 3,
  verbose: boolean = false
): Promise<any[]> { // Use appropriate return type
  const list_input: boolean = Array.isArray(user_prompt);
  const dynamic_elements: boolean = /<.*?>/.test(JSON.stringify(output_format));
  const list_output: boolean = /\[.*?\]/.test(JSON.stringify(output_format));

  let error_msg: string = "";
  let res: string = ""; // Declare res here to make it accessible in the catch block

  for (let i = 0; i < num_tries; i++) {
    let output_format_prompt: string = `\nYou are to output ${
      list_output ? "an array of objects in" : ""
    } the following in JSON format: ${JSON.stringify(output_format)}. 
    Do not use quotation marks or escape characters \\ in the output fields.`;

    if (list_output) {
      output_format_prompt += `\nIf an output field is a list, classify output into the best element of the list.`;
    }

    if (dynamic_elements) {
      output_format_prompt += `\nText enclosed by < and > requires content generation to replace it. Example input: Go to <location>; Example output: Go to the garden.
      Keys with < and > in them also need replacement, e.g., {'<location>': 'description'} becomes {school: 'a place for education'}.`;
    }

    if (list_input) {
      output_format_prompt += `\nGenerate an array of JSON objects, one for each input element.`;
    }

    try {
      const response: ChatCompletion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: system_prompt + output_format_prompt + error_msg,
          },
          { 
            role: "user", 
            content: Array.isArray(user_prompt) ? user_prompt.join(", ") : user_prompt 
          },
        ],
        temperature: temperature,
      });

      res = response.choices[0].message?.content ?? ""; // Assign to res here

      // Clean up the response string
      res = res.replace(/'/g, '"').replace(/(\w)"(\w)/g, "$1'$2");

      if (verbose) {
        console.log("System prompt:", system_prompt + output_format_prompt + error_msg);
        console.log("\nUser prompt:", user_prompt);
        console.log("\nGPT response:", res);
      }

      let output = JSON.parse(res);

      if (list_input) {
        if (!Array.isArray(output)) throw new Error("Output format not an array of JSON objects");
      } else {
        output = [output];
      }

      for (let index = 0; index < output.length; index++) {
        for (const key in output_format) {
          if (/<.*?>/.test(key)) continue;

          if (!(key in output[index])) throw new Error(`${key} not in JSON output`);

          if (Array.isArray(output_format[key])) {
            const choices = output_format[key] as string[];
            if (Array.isArray(output[index][key])) output[index][key] = output[index][key][0];
            if (!choices.includes(output[index][key]) && default_category) {
              output[index][key] = default_category;
            }
            if (output[index][key].includes(":")) {
              output[index][key] = output[index][key].split(":")[0];
            }
          }
        }

        if (output_value_only) {
          output[index] = Object.values(output[index]);
          if (output[index].length === 1) {
            output[index] = output[index][0];
          }
        }
      }

      return list_input ? output : output[0];
    } catch (e) {
      error_msg = `\n\nResult: ${res}\n\nError message: ${e instanceof Error ? e.message : e}`;
      console.log("An exception occurred:", e);
      console.log("Invalid JSON format:", res);
    }
  }

  return [];
}
