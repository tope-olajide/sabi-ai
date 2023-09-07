import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import EditNoteIcon from "@mui/icons-material/EditNote";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import Translate from "@mui/icons-material/Translate";
import ShortTextIcon from "@mui/icons-material/ShortText";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
export default function MobileNav({ pageTitle }: any) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    pageTitle === "Grammar Checker"
      ? setValue(0)
      : pageTitle === "Paraphraser"
      ? setValue(1)
      : pageTitle === "Summarizer"
      ? setValue(2)
      : pageTitle === "Translator"
      ? setValue(3)
      : setValue(4);
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: {
          xs: "block",
          sm: "block",
          md: "none",
          lg: "none",
          xl: "none",
          xxl: "none",
        },
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label=""
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        sx={{ width: "100%" }}
      >
        <Link underline="none" href="/">
          <Tab icon={<SpellcheckIcon />} label="Grammar Checker" />
        </Link>
        <Link underline="none" href="/paraphraser">
          <Tab icon={<HistoryEduIcon />} label="Paraphraser" />
        </Link>
        <Link underline="none" href="/summarize">
          <Tab icon={<ShortTextIcon />} label="Summarizer" />
        </Link>
        <Link underline="none" href="/translate">
          <Tab icon={<Translate />} label="Translator" />
        </Link>
        <Link underline="none" href="/generate-content">
          <Tab icon={<EditNoteIcon />} label="Content Generator" />
        </Link>
      </Tabs>
    </Box>
  );
}
