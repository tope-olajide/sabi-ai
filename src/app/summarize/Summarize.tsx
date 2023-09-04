"use client";
import SideBar from "@/components/SideBar";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState, ChangeEvent, useRef } from "react";
/* function valuetext(value: number) {
  
  return 'value.toString()';
} */


const Summarize = () => {
  const [value, setValue] = useState("Short");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
 const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  setValue((event.target as HTMLInputElement).value);
  }; 
  const [isSummarizing, setIsSummarizing] = useState(false); 

  const summarizeText = async () => {
    const textData = editorRef.current!.innerText;
    if (!textData.trim()) {
      return;
    }
    try {
      setIsSummarizing(true);
      const response = await fetch("https://sability-ai.onrender.com/summarize-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textData: editorRef.current!.innerText, length:value }),
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
      <SideBar pageTitle="Summarizer">
        <section className="input-output-container">
          {/* <div className="summarize-mode">
            <h4>Summary Length:</h4>{" "}
            <div className="slider-section">
              <h5>Short</h5>
              <Slider
                sx={{ width: "200px" }}
                aria-label="Temperature"
                defaultValue={30}
                getAriaValueText={valuetext}
                valueLabelDisplay="auto"
                step={10}
                marks
                min={10}
                max={50}
              />
              <h5>Long</h5>
            </div>
          </div> */}
           <div className="summarize-length-section">
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: 'center',
                width: '100%',
                padding:4
              }}
            >
              <FormLabel sx={{ width:'150px', mr:2 }}>Summary Length</FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  width: "100%",
                }}
              >
                <FormControlLabel
                  value="Very Short"
                  control={<Radio />}
                  label="Very Short"
                />
                <FormControlLabel
                  value="Short"
                  control={<Radio />}
                  label="Short"
                />
                <FormControlLabel
                  value="Medium-length"
                  control={<Radio />}
                  label="Medium"
                />
                <FormControlLabel
                  value="Detailed"
                  control={<Radio />}
                  label="Detailed"
                />
              </RadioGroup>
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
                  Summarize
                </Button>
              </div>
            </section>
            <section className="output-container">
              <div className="output" ref={outputRef}>
                
              </div>
              {/* <div className="sub_div">
                
                <p>0 Sentences </p>

                <p>0 Words</p>
              </div> */}
            </section>
          </section>
        </section>
      </SideBar>
    </>
  );
};
export default Summarize;
