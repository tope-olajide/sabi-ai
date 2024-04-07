"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import SideBar from "@/components/SideBar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import AlertDialog from "@/components/Dialog";
import { countWords, handlePaste } from "../utils/CommonFunctions";

const ContentGenerator = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputWordCount, setInputWordCount] = useState(0);

  useEffect(() => {
    focusEditor();
  }, []);

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const generateContent = async () => {
    try {
      const textData = editorRef.current!.innerText.trim();
      if (!textData) {
        throw new Error("No text data to generate content.");
      }
      if (inputWordCount > 100) {
        setIsDialogOpen(true);
        return;
      }
      setIsGenerating(true);
      const response = await fetch("https://sability-ai.onrender.com/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textData }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate content. Please try again later.");
      }
      const { queryResult } = await response.json();
      outputRef.current!.innerHTML = queryResult;
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEditorChange = (event: ChangeEvent<HTMLDivElement>) => {
    setIsEditorEmpty(!editorRef.current?.innerText);
    setInputWordCount(countWords(editorRef.current!.innerText));
  };

  return (
    <>
      <SideBar pageTitle="Content Generator">
        <Card className="input-output-container" style={{ minHeight: "385px" }}>
          <section className="input-output-section">
            <section className="input-container" onClick={focusEditor}>
              <div className="translate-header-section">
                <h3>Describe the topic you want to write about</h3>
              </div>
              <div
                contentEditable
                className="editable"
                ref={editorRef}
                onInput={(e: any) => handleEditorChange(e)}
                onPaste={(e: any) =>
                  handlePaste(e, editorRef, setInputWordCount, setIsEditorEmpty)
                }
              />

              {isEditorEmpty ? null : (
                <div className="sub_div generate_sub_div">
                  <p>Words: {inputWordCount}</p>
                  <Button
                    sx={{ textTransform: "capitalize" }}
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
              <div className="translate-header-section">
                <h3>Output</h3>
              </div>
              <div className="output" ref={outputRef}></div>
              <div className="sub_div"></div>
            </section>
          </section>
        </Card>
      </SideBar>
      <AlertDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        dialogTitle="Word Limit Exceeded"
        dialogContent="Content generation is currently limited to 100 words."
      />
    </>
  );
};

export default ContentGenerator;
