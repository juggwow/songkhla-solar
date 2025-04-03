import { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Container, Typography, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import QouteTable from '@/component/qoute-table';
import { CAQoute } from '@/type/ca';
import { useAlertLoading } from '@/component/alert-loading';

export default function QouteList() {
  const router = useRouter();
  const [quoteList, setQuoteList] = useState<CAQoute[]>([]);
  const { loading, alert } = useAlertLoading();

  useEffect(() => {
    fetchAllQuotes();
  }, []);

  const fetchAllQuotes = async () => {
    loading(true);
    try {
      const res = await fetch('/api/ca/ca-qoute');
      if (res.status === 200) {
        const data = await res.json();
        setQuoteList(data);
      } else {
        alert('ไม่สามารถดึงข้อมูลใบเสนอราคาได้', 'error');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
    } finally {
      loading(false);
    }
  };

  const handleEditQuote = (id: string) => {
    router.push(`/qoute/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('คุณต้องการลบใบเสนอราคานี้ใช่หรือไม่?')) {
      loading(true);
      const res = await fetch(`/api/ca/ca-qoute/${id}`, {
        method: 'DELETE',
      });
      loading(false);
      
      if (res.status === 200) {
        alert('ลบใบเสนอราคาสำเร็จ', 'success');
        fetchAllQuotes();
      } else {
        alert('ไม่สามารถลบใบเสนอราคาได้', 'error');
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h5" fontWeight={600}>
              รายการใบเสนอราคาทั้งหมด
            </Typography>
          </Grid>
          
          <QouteTable 
            showCAQoutes={quoteList} 
            handleEditQoute={handleEditQuote}
            handleDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </Container>
  );
} 