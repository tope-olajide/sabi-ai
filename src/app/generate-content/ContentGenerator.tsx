"use client";
import SideBar from "@/components/SideBar";
import Button from "@mui/material/Button";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState, ChangeEvent, useRef, useEffect } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";

const ContentGenerator = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };
  useEffect(() => {
    focusEditor();
  }, []);
  const generateContent = async () => {
    const textData = editorRef.current!.innerText;
    if (!textData.trim()) {
      return;
    }
    try {
      setIsGenerating(true);
      const response = await fetch("http://localhost:5000/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textData: editorRef.current!.innerText,
        }),
      });
      const result = await response.json();
      console.log(result.queryResult.response);
      setIsGenerating(false);
      const paraphrasedText = result.queryResult.response;
      outputRef.current!.innerHTML = "";
      outputRef.current!.innerHTML = paraphrasedText;
    } catch (error) {
      setIsGenerating(false);
      console.log(error);
    }
  };
  const handleEditorChange = (event: ChangeEvent<HTMLDivElement>) => {
    if (editorRef.current?.innerHTML) {
      setIsEditorEmpty(false);
    } else {
      setIsEditorEmpty(true);
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
  return (
    <>
      <SideBar pageTitle="Content Generator">
        <Card className="input-output-container">
          <div className="translate-header-section">
            <h3>Input</h3>
            <h3>Output</h3>
          </div>
          <section className="input-output-section">
            <section className="input-container" onClick={focusEditor}>
              <div>
                <div
                  contentEditable
                  className="editable"
                  ref={editorRef}
                  onInput={(e: any) => handleEditorChange(e)}
                  onPaste={handlePaste}
                ></div>
                {isEditorEmpty ? (
                  <h1 className="placeholder-text" onClick={focusEditor}>
                    Describe the topic you want to write about and explain the
                    format or structure you want the content to take.
                  </h1>
                ) : null}
              </div>

              {isEditorEmpty ? null : (
                <div className="sub_div generate_sub_div">
                  <Button
                    sx={{ textTransform: "Capitalize" }}
                    variant="contained"
                    onClick={generateContent}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate Content"}
                  </Button>
                </div>
              )}
            </section>
            <section className="output-container">
              <div className="output" ref={outputRef}></div>
              <div className="sub_div">
                {/*  <p>0 Sentences </p>

                <p>0 Words</p> */}
              </div>
            </section>
          </section>
        </Card>
      </SideBar>
    </>
  );
};
export default ContentGenerator;
