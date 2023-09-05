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
import PublishIcon from "@mui/icons-material/Publish";
/* function valuetext(value: number) {
  
  return 'value.toString()';
} */

const Summarize = () => {
  const [value, setValue] = useState("Short");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [inputWordCount, setInputWordCount] = useState(0);
  const summarizeText = async () => {
    const textData = editorRef.current!.innerText;
    if (!textData.trim()) {
      return;
    }
    try {
      setIsSummarizing(true);
      const response = await fetch(
        "https://sability-ai.onrender.com/summarize-text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            textData: editorRef.current!.innerText,
            length: value,
          }),
        }
      );
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
  const handlePaste = (e: any) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    const selection = window.getSelection();
    const range = selection!.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);
    selection!.removeAllRanges();
    selection!.addRange(range);
    setIsEditorEmpty(false);
  };
  const countWords = (text: string) => {
    const words = text.split(" ");
    const filteredWords = words.filter((word) => word.trim() !== "");
    return filteredWords.length;
  };
  const handleEditorChange = (event: ChangeEvent<HTMLDivElement>) => {
    if (editorRef.current?.innerHTML) {
      setIsEditorEmpty(false);
    } else {
      setIsEditorEmpty(true);
    }
    setInputWordCount(countWords(editorRef.current!.innerText));
  };
  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (editorRef.current) {
        const div = editorRef.current;
        const selection = window.getSelection();
        if (selection) {
          const range = selection.getRangeAt(0);
          const textNode = document.createTextNode(text);
          range.deleteContents();
          range.insertNode(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
          div.focus();
          setIsEditorEmpty(false);
          setInputWordCount(countWords(editorRef.current!.innerText));
        }
      }
    } catch (error) {
      console.error("Unable to read clipboard data: ", error);
    }
  };
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/grammar-checker/api", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success === false) {
        console.log(result.message);

        return alert(result.message);
      }

      editorRef.current!.innerHTML = "";
      editorRef.current!.innerHTML = result.data;
      setIsEditorEmpty(false);
      setInputWordCount(countWords(editorRef.current!.innerText));
    } else {
      alert("Please select a PDF file.");
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
                justifyContent: "center",
                width: "100%",
                padding: 4,
              }}
            >
              <FormLabel sx={{ width: "150px", mr: 2 }}>
                Summary Length
              </FormLabel>
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
              <div
                contentEditable
                className="editable"
                ref={editorRef}
                onPaste={handlePaste}
                onInput={(e: any) => handleEditorChange(e)}
              ></div>
              <div className="sub_div">
                {isEditorEmpty ? (
                  <Button
                    sx={{ textTransform: "none" }}
                    variant="outlined"
                    onClick={handlePasteClick}
                  >
                    Paste
                  </Button>
                ) : null}
                {isEditorEmpty ? (
                  <div>
                    {" "}
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                      ref={fileInputRef}
                    />
                    <Button
                      sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        borderRadius: 5,
                      }}
                      size="small"
                      variant="outlined"
                      startIcon={<PublishIcon />}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload PDF
                    </Button>
                  </div>
                ) : null}
                {isEditorEmpty ? null : <h5>Words:{inputWordCount}</h5>}
                {isEditorEmpty ? null : (
                  <Button
                    sx={{ textTransform: "Capitalize" }}
                    variant="contained"
                    onClick={summarizeText}
                    disabled={isSummarizing}
                  >
                    Summarize
                  </Button>
                )}
              </div>
            </section>
            <section className="output-container">
              <div className="output" ref={outputRef}></div>
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
