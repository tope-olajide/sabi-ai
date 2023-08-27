"use client";
import './editor.css'
import {
  Popover,
  Box,
  Typography,
  Badge,
  IconButton,
  Button,
} from "@mui/material";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import DeleteIcon from "@mui/icons-material/Delete";
const Editor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
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

  const [exceptionList, setExceptionList] = useState([""]);
  const checkWords = () => {
    const outputString = `Sability <span class='highlight' data-corrected='helps' data-error-type='verb agreement'>help</span> you to improve your content on millions of websites! Write or paste your <span class='highlight' data-corrected='sentence' data-error-type='spelling'>sentense</span> to get it checked for <span class='highlight' data-corrected='grammar' data-error-type='spelling'>gramar</span> and spelling errors. If there is a mistake, the app will highlight it. Just hover over the correction to review and <span class='highlight' data-corrected='accept' data-error-type='spelling'>acept</span> it!`;
    const newHTMLData = excemptWord(outputString, exceptionList);
    editorRef.current!.innerHTML = newHTMLData;
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
  const [selectedWord, setSelectedWord] = useState<SelectedWord>();
  const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const correctWord = () => {
    const textNode = document.createTextNode(selectedWord!.corrected);
    anchorEl?.parentNode?.replaceChild(textNode, anchorEl);
    handleClose();
  };

  let timer: NodeJS.Timeout;
  const handleEditorChange = (event: ChangeEvent<HTMLDivElement>) => {
    clearTimeout(timer);
    const newTimer: NodeJS.Timeout = setTimeout(() => {
      const newText = event.target.textContent;
      console.log("sending data...");
      console.log(newText);
    }, 2000);
    timer = newTimer;
  };
  useEffect(() => {
    checkWords();
  }, [exceptionList]);
  useEffect(() => {
    const handleClickOnHighlight = (event) => {
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
  return (
    <div>
      <div
        id="text"
        contentEditable
        className="editor-section"
        onInput={(e) => handleEditorChange(e)}
        ref={editorRef}
      />
      <button onClick={checkWords}>Highlight Incorrect Grammar</button>
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

    </div>
  );
};

export default Editor;
