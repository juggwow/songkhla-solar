import { Button } from "@mui/material";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";

import { useState } from "react";

Font.register({
  family: "THSarabunNew",
  src: "./../public/fonts/THSarabunNew.ttf",
});


const styles = StyleSheet.create({
  font: {
    fontFamily: 'THSarabunNew',
    fontSize: 12,
  },
  page: {
    backgroundColor: "#d11fb6",
    color: "white",
  },
  section: {
    margin: 10,
    padding: 10,
  },
  viewer: {
    width: 1024, //the pdf viewer will take up all of the width and height
  },
});

// Create Document Component
export default function BasicDocument() {
  const [open, isOpen] = useState(false);


  
  return (
    <div>
      <Button onClick={() => isOpen(true)}>เปิดสิ!!</Button>
      {open && (
        <PDFViewer style={styles.viewer}>
          {/* Start of the document*/}
          <Document>
            {/*render a single page*/}
            <Page size="A4" style={styles.page}>
              <View style={styles.section}>
                <Text style={styles.font}>Hello ทดสอบๆๆๆๆๆ</Text>
              </View>
              <View style={styles.section}>
                <Text>World</Text>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      )}
    </div>
  );
}
