import { SelectChangeEvent, Select, MenuItem } from "@mui/material";

const TargetLangaugeOptions = ({
  language,
  handleChange,
}: {
  language: string;
  handleChange: (event: SelectChangeEvent) => void;
}) => {
  return (
    <>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={language}
        label="Language"
        onChange={handleChange}
      >
        <MenuItem value={"English"}>English</MenuItem>
        <MenuItem value={"Spanish"}>Spanish</MenuItem>
        <MenuItem value={"French"}>French</MenuItem>
        <MenuItem value={"German"}>German</MenuItem>
        <MenuItem value={"Chinese (Simplified and Traditional)"}>
          Chinese (Simplified and Traditional)
        </MenuItem>
        <MenuItem value={"Japanese"}>Japanese</MenuItem>
        <MenuItem value={"Korean"}>Korean</MenuItem>
        <MenuItem value={"Italian"}>Italian</MenuItem>
        <MenuItem value={"Portuguese (European and Brazilian)"}>
          Portuguese (European and Brazilian)
        </MenuItem>
        <MenuItem value={"Arabic"}>Arabic</MenuItem>
        <MenuItem value={"Hindi"}>Hindi</MenuItem>
        <MenuItem value={"Turkish"}>Turkish</MenuItem>
        <MenuItem value={"Swedish"}>Swedish</MenuItem>
        <MenuItem value={"Norwegian"}>Norwegian</MenuItem>
        <MenuItem value={"Danish"}>Danish</MenuItem>
        <MenuItem value={"Finnish"}>Finnish</MenuItem>
        <MenuItem value={"Polish"}>Polish</MenuItem>
        <MenuItem value={"Greek"}>Greek</MenuItem>
        <MenuItem value={"Romanian"}>Romanian</MenuItem>
        <MenuItem value={"Czech"}>Czech</MenuItem>
      </Select>
    </>
  );
};

export default TargetLangaugeOptions;
