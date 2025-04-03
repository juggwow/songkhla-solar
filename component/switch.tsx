import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";

export default function GroupSizesColors({
  onClick,
  rightText,
}: {
  onClick: (list: "left" | "right") => void;
  rightText: string;
}) {
  return (
    <Box sx={{ margin: "1rem 0 0 0" }}>
      <ButtonGroup color="success" aria-label="Small button group">
        <Button onClick={() => onClick("right")} id="qoute-list" key="two">
          {rightText}
        </Button>
      </ButtonGroup>
    </Box>
  );
}
