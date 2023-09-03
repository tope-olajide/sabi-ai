"use client";
import SideBar from "@/components/SideBar";
import Button from "@mui/material/Button";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState, ChangeEvent, useRef } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

const Translator = () => {
  const [value, setValue] = useState("Short");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const [age, setAge] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const [isSummarizing, setIsSummarizing] = useState(false);

  const summarizeText = async () => {
    const textData = editorRef.current!.innerText;
    if (!textData.trim()) {
      return;
    }
    try {
      setIsSummarizing(true);
      const response = await fetch("http://localhost:5000/summarize-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textData: editorRef.current!.innerText,
          length: value,
        }),
      });
      const result = await response.json();
      console.log(result.queryResult.response);
      setIsSummarizing(false);
      const paraphrasedText = result.queryResult.response;
      outputRef.current!.innerHTML = "";
      outputRef.current!.innerHTML = paraphrasedText;
    } catch (error) {
      setIsSummarizing(false);
      console.log(error);
    }
  };
  return (
    <>
      <SideBar pageTitle="Translator">
        <section className="input-output-container">
          <div className="translate-header-section">
            <FormControl sx={{ minWidth: "140px" }} disabled size="small">
              <InputLabel>Auto Detect</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                
               
              ></Select>
            </FormControl>
            <FormControl sx={{ minWidth: "150px" }} size="small">
              <InputLabel id="demo-simple-select-label">Target Language</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={'English'}>English</MenuItem>
                <MenuItem value={'Spanish'}>Spanish</MenuItem>
                <MenuItem value={'French'}>French</MenuItem>
                <MenuItem value={'German'}>German</MenuItem>
                <MenuItem value={'Chinese (Simplified and Traditional)'}>Chinese (Simplified and Traditional)</MenuItem>
                <MenuItem value={'Japanese'}>Japanese</MenuItem>
                <MenuItem value={'Korean'}>Korean</MenuItem>
                <MenuItem value={'Italian'}>Italian</MenuItem>
                <MenuItem value={'Portuguese (European and Brazilian)'}>Portuguese (European and Brazilian)</MenuItem>
              </Select>
            </FormControl>
          </div>
          <section className="input-output-section">
            <section className="input-container">
              <div contentEditable className="editable" ref={editorRef}></div>
              <div className="sub_div">
                <Button sx={{ textTransform: "none" }} variant="outlined">
                  Upload PDF
                </Button>
                <Button
                  sx={{ textTransform: "Capitalize" }}
                  variant="contained"
                  onClick={summarizeText}
                  disabled={isSummarizing}
                >
                  Translate
                </Button>
              </div>
            </section>
            <section className="output-container">
              <div className="output" ref={outputRef}></div>
              <div className="sub_div">
                <p>0 Sentences </p>

                <p>0 Words</p>
              </div>
            </section>
          </section>
        </section>
      </SideBar>
    </>
  );
};
export default Translator;
