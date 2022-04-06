import { Box, Container } from '@mui/material';
import { Header, NotFound } from 'components/common';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { CreateEditPage, MainPage, MyPostListPage, PostDetailPage, SavedPage } from './pages';

export default function Blog() {
  return (
    <Box>
      <Header />

      <Box component="main" pt={3}>
        <Container>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="my" element={<MyPostListPage />} />
            <Route path="saved" element={<SavedPage />} />
            <Route path="create" element={<CreateEditPage />} />
            <Route path="edit/:id" element={<CreateEditPage />} />
            <Route path=":slug" element={<PostDetailPage />} />
            <Route path=":404" element={<NotFound />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}
