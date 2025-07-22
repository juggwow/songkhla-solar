import { Container, Typography, Card, CardContent, Grid, Box, Paper } from '@mui/material';
import { useState } from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import TimelineIcon from '@mui/icons-material/Timeline';

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const reportItems = [
    { 
      id: 'summary', 
      title: 'รายงานสรุปภาพรวม', 
      icon: <AssessmentIcon fontSize="large" color="primary" />,
      description: 'รายงานสรุปภาพรวมการเสนอราคาและมูลค่ารวมทั้งหมด'
    },
    { 
      id: 'transformer', 
      title: 'รายงานหม้อแปลง', 
      icon: <PieChartIcon fontSize="large" color="primary" />,
      description: 'รายงานแสดงประเภทและจำนวนของหม้อแปลงที่มีการเสนอราคา'
    },
    { 
      id: 'monthly', 
      title: 'รายงานรายเดือน', 
      icon: <BarChartIcon fontSize="large" color="primary" />,
      description: 'รายงานแสดงยอดมูลค่าการเสนอราคาในแต่ละเดือน'
    },
    { 
      id: 'trend', 
      title: 'รายงานแนวโน้ม', 
      icon: <TimelineIcon fontSize="large" color="primary" />,
      description: 'รายงานแสดงแนวโน้มการเติบโตของมูลค่าการเสนอราคา'
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        ระบบรายงาน
      </Typography>

      <Grid container spacing={3}>
        {/* รายการรายงาน */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                รายงานที่มีให้บริการ
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {reportItems.map((item) => (
                  <Paper 
                    key={item.id}
                    elevation={selectedReport === item.id ? 3 : 1}
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer',
                      border: selectedReport === item.id ? '1px solid #0056b3' : '1px solid transparent',
                      backgroundColor: selectedReport === item.id ? 'rgba(0, 86, 179, 0.05)' : 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 86, 179, 0.05)'
                      }
                    }}
                    onClick={() => setSelectedReport(item.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {item.icon}
                      <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 500 }}>
                        {item.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* พื้นที่แสดงรายงาน */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ minHeight: '500px' }}>
            <CardContent>
              {!selectedReport ? (
                <Box 
                  sx={{ 
                    height: '500px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column'
                  }}
                >
                  <AssessmentIcon sx={{ fontSize: 100, color: '#0056b3', opacity: 0.3, mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    กรุณาเลือกรายงานที่ต้องการดูจากเมนูด้านซ้าย
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
                    {reportItems.find(item => item.id === selectedReport)?.title}
                  </Typography>
                  
                  <Box 
                    sx={{ 
                      height: '450px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <Typography>
                      อยู่ระหว่างการพัฒนา - รายงานนี้จะพร้อมใช้งานเร็วๆ นี้
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 