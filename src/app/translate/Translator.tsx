"use client";
import SideBar from "@/components/SideBar";
import Button from "@mui/material/Button";

import FormControl from "@mui/material/FormControl";
import { useState, ChangeEvent, useRef, useEffect } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import PublishIcon from "@mui/icons-material/Publish";
import Card from "@mui/material/Card";
import AlertDialog from "@/components/Dialog";
import TargetLangaugeOptions from "./TargetLangaugeOptions";
import {
  countWords,
  handleFileChange,
  handlePaste,
  handlePasteClick,
} from "../utils/CommonFunctions";

const Translator = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const outputRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [language, setLanguage] = useState("");
  const [inputWordCount, setInputWordCount] = useState(0);
  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    message: "",
  });
  const translateText = async () => {
    try {
      const textData = editorRef.current!.innerText;
      if (!textData.trim()) {
        return;
      }
      if (!language) {
        setDialogContent({
          title: "No Target Language",
          message: "You must select a target language!",
        });
        setIsDialogOpen(true);
        return;
      }
      if (inputWordCount > 100) {
        setDialogContent({
          title: "Word Limit Exceeded",
          message: "Translator is currently limited to 100 words.",
        });
        setIsDialogOpen(true);
        return;
      }

      setIsTranslating(true);

      const response = await fetch("https://sability-ai.onrender.com/translate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          textData: editorRef.current!.innerText,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to translate text. Please try again later.");
      }

      const result = await response.json();
      setIsTranslating(false);
      const translated = result.queryResult;
      outputRef.current!.innerHTML = "";
      outputRef.current!.innerHTML = translated;
    } catch (error) {
      setIsTranslating(false);
      console.error("Error translating text:", error);
    }
  };

  const handleEditorChange = (event: ChangeEvent<HTMLDivElement>) => {
    if (editorRef.current?.innerHTML) {
      setIsEditorEmpty(false);
    } else {
      setIsEditorEmpty(true);
    }
    setInputWordCount(countWords(editorRef.current!.innerText));
  };

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  useEffect(() => {
    focusEditor();
  }, []);
  return (
    <>
      <SideBar pageTitle="Translator">
        <Card className="input-output-container">
          <div className="translate-header-section">
            <FormControl sx={{ minWidth: "140px" }} disabled size="small">
              <InputLabel>Auto Detect</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
              ></Select>
            </FormControl>
            <FormControl sx={{ minWidth: "150px" }} size="small">
              <InputLabel id="demo-simple-select-label">
                Target Language
              </InputLabel>
              <TargetLangaugeOptions
                language={language}
                handleChange={handleChange}
              />
            </FormControl>
          </div>
          <section className="input-output-section">
            <section className="input-container" onClick={focusEditor}>
              <div
                contentEditable
                className="editable"
                ref={editorRef}
                onPaste={(e: any) =>
                  handlePaste(e, editorRef, setInputWordCount, setIsEditorEmpty)
                }
                onInput={(e: any) => handleEditorChange(e)}
              ></div>
              <div className="sub_div">
                {isEditorEmpty ? (
                  <Button
                    sx={{ textTransform: "none" }}
                    variant="outlined"
                    onClick={(e) =>
                      handlePasteClick(
                        editorRef,
                        setIsEditorEmpty,
                        setInputWordCount
                      )
                    }
                  >
                    Paste
                  </Button>
                ) : null}
                {isEditorEmpty ? (
                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        handleFileChange(
                          e,
                          editorRef,
                          setInputWordCount,
                          setIsEditorEmpty
                        )
                      }
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
                    onClick={translateText}
                    disabled={isTranslating}
                  >
                    {isTranslating ? "Translating..." : "Translate"}
                  </Button>
                )}
              </div>
            </section>
            <section className="output-container">
              <div className="output" ref={outputRef}></div>

              <div className="sub_div"></div>
            </section>
          </section>
        </Card>
      </SideBar>
      <AlertDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        dialogTitle={dialogContent.title}
        dialogContent={dialogContent.message}
      />
    </>
  );
};
export default Translator;
