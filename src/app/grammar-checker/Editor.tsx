"use client";
import "./editor.css";
import {
  Popover,
  Box,
  Typography,
  Badge,
  IconButton,
  Button,
  Grid,
  CircularProgress,
  Card,
} from "@mui/material";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import PublishIcon from "@mui/icons-material/Publish";
import Divider from "@mui/material/Divider";

const Editor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [wordCount, setWordCount] = useState(0);
  const [exceptionList, setExceptionList] = useState([""]);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);
  const [selectedWord, setSelectedWord] = useState<SelectedWord>();
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);

  function excemptWord(htmlString: string, exceptionList: string | string[]) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const spans = doc.querySelectorAll(".highlight");
    spans.forEach((span) => {
      const correctedValue = span.textContent;
      if (correctedValue && exceptionList.includes(correctedValue)) {
        span.classList.remove("highlight");
        span.removeAttribute("data-corrected");
        span.removeAttribute("data-error-type");
      }
    });
    return doc.body.innerHTML;
  }

  const checkForErrors = async () => {
    try {
      setIsCheckingGrammar(true);
      const response = await fetch(
        "https://sability-ai.onrender.com/grammar-check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ textData: editorRef.current!.innerText }),
        }
      );
      const result = await response.json();
      console.log(result.queryResult.response);
      setIsCheckingGrammar(false);
      if (!isTyping) {
        const newHTMLData = result.queryResult.response;
        let outputString = newHTMLData.replace(/"""+/g, "");
        editorRef.current!.innerHTML = "";
        editorRef.current!.innerHTML = excemptWord(outputString, exceptionList);
      }
    } catch (error) {
      setIsCheckingGrammar(false);
      console.log(error);
    }
  };
  const setExcemption = () => {
    const exceptionListCopy = [...exceptionList, selectedWord!.word];
    setExceptionList(exceptionListCopy);
    handleClose();
  };
  type SelectedWord = {
    corrected: string;
    errorType: string;
    word: string;
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const correctWord = () => {
    const textNode = document.createTextNode(selectedWord!.corrected);
    anchorEl?.parentNode?.replaceChild(textNode, anchorEl);
    console.log(editorRef.current!.innerText);
    handleClose();
  };

  const handleEditorChange = (event: ChangeEvent<HTMLDivElement>) => {
    if (editorRef.current?.innerHTML) {
      setIsEditorEmpty(false);
    } else {
      setIsEditorEmpty(true);
    }
    setWordCount(countWords(editorRef.current!.innerText));
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
    setWordCount(countWords(editorRef.current!.innerText));
  };

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  useEffect(() => {
    focusEditor();
  }, []);

  useEffect(() => {
    const result = excemptWord(editorRef.current!.innerHTML, exceptionList);
    editorRef.current!.innerHTML = "";
    editorRef.current!.innerHTML = result;
  }, [exceptionList]);

  useEffect(() => {
    const handleClickOnHighlight = (event: any) => {
      if (event.target.classList.contains("highlight")) {
        const clickedText = event.target.textContent;
        const corrected = event.target.dataset.corrected;
        const errorType = event.target.dataset.errorType;
        setSelectedWord({ word: clickedText, corrected, errorType });
        setAnchorEl(event.target);
      }
    };
    document.addEventListener("click", handleClickOnHighlight);
    return () => {
      document.removeEventListener("click", handleClickOnHighlight);
    };
  }, []);

  const countWords = (text: string) => {
    const words = text.split(" ");
    const filteredWords = words.filter((word) => word.trim() !== "");
    return filteredWords.length;
  };
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setIsCheckingGrammar(true);
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/grammar-checker/api", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setIsCheckingGrammar(false);
      if (result.success === false) {
        console.log(result.message);

        return alert(result.message);
      }
      setIsEditorEmpty(false);
      editorRef.current!.innerHTML = "";
      editorRef.current!.innerHTML = result.data;

      const totalWordCount = countWords(result.data);
      setWordCount(totalWordCount);
      //setSelectedFile(file);
    } else {
      alert("Please select a PDF file.");
    }
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
          setWordCount(countWords(editorRef.current!.innerText));
        }
      }
    } catch (error) {
      console.error("Unable to read clipboard data: ", error);
    }
  };
  return (
    <>
      <Card className="editor-section" onClick={focusEditor}>
        <section>
          <div
            contentEditable
            className="editor"
            onInput={(e: any) => handleEditorChange(e)}
            ref={editorRef}
            onPaste={handlePaste}
          />
          {isEditorEmpty ? (
            <div className="placeholder-container">
              <h1 className="placeholder-text" onClick={focusEditor}>
                Start by writing, pasting (Ctrl + V) text, or uploading a
                document(pdf), then click the Check for Errors button.
              </h1>
              <Box sx={{ mt: 1 }}>
                <Button
                  sx={{
                    mr: 3,
                    mt: 1,
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: 5,
                  }}
                  size="small"
                  variant="outlined"
                  startIcon={<ContentPasteIcon />}
                  onClick={handlePasteClick}
                >
                  Paste Text
                </Button>
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
                    mt: 1,
                  }}
                  size="small"
                  variant="outlined"
                  startIcon={<PublishIcon />}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Upload Document
                </Button>
              </Box>
            </div>
          ) : null}
        </section>

        {isEditorEmpty ? null : (
          <Card className="editor-options" color="secondary">
            {isCheckingGrammar ? (
              <CircularProgress size={30} />
            ) : (
              <Button
                variant="contained"
                sx={{ textTransform: "none", borderRadius: 5 }}
                onClick={checkForErrors}
                size="small"
                color="primary"
              >
                Check for Errors
              </Button>
            )}
            <Divider orientation="vertical" flexItem />{" "}
            <div>{wordCount} Words</div>
            {/* <Divider orientation="vertical" flexItem />{" "} */}
            {/*  
         {" "}
          <Divider orientation="vertical" flexItem />
          <FileDownloadIcon /> <ContentCopyIcon />{" "} */}
          </Card>
        )}
      </Card>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ p: 2, minWidth: "200px" }}>
            <Badge color="error" variant="dot" sx={{ mr: 1 }}></Badge>
            {selectedWord?.errorType}
          </Typography>
          <IconButton aria-label="delete" onClick={setExcemption}>
            <DeleteIcon sx={{ width: "20px", height: "20px" }} />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pb: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{ textTransform: "none" }}
            onClick={correctWord}
          >
            {selectedWord?.corrected}
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default Editor;
