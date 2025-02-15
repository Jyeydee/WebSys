import React from 'react';
import { Container, Typography, TextField, Button, Box, Paper, FormControl, InputLabel } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import Main from '@/layout/mainLayout';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const ProfilePage: React.FC = () => {
  const { data, error } = useSWR('/api/user', fetcher);

  if (error) return <div>Error loading user data</div>;
  if (!data) return <div>Loading...</div>;

  const { id, name, email, bio, post } = data; 
  return (
    <Main>
      <Container className='w-1/2 justify-start' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Box component={Paper} p={4} style={{ backgroundColor: 'rgba(34, 139, 34, 0.9)', boxShadow: '0 6px 12px rgba(0, 100, 0, 0.5)', borderRadius: '8px', textAlign: 'center', width: '100%', border: '2px solid rgba(0, 100, 0, 0.7)' }}>
          <Typography variant="h1" gutterBottom style={{ color: 'white' }}>Profile</Typography>
          <Formik
            initialValues={{ id, name, email, bio, post }}
            onSubmit={(values, actions) => {
              axios.put('/api/user', values)
                .then(res => {
                  mutate('/api/user', values, false);
                  console.log('Profile updated successfully');
                })
                .catch(err => {
                  console.error('Error updating profile:', err);
                })
                .finally(() => {
                  actions.setSubmitting(false);
                });
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormControl fullWidth style={{ margin: '2rem 0', textAlign: 'center' }}>
                  <InputLabel shrink style={{ color: 'white', padding: '-10px 10px', margin: '-10px' }}>
                    Name
                  </InputLabel>
                  <Field
                    name="name"
                    as={TextField}
                    InputProps={{ style: { color: 'white' } }}
                    style={{ color: 'white' }}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: '2rem 0', textAlign: 'center' }}>
                  <InputLabel shrink style={{ color: 'white', padding: '-10px 10px', margin: '-10px' }}>
                    Email
                  </InputLabel>
                  <Field
                    name="email"
                    as={TextField}
                    InputProps={{ style: { color: 'white' } }}
                    style={{ color: 'white' }}
                  />
                </FormControl>
                <FormControl fullWidth style={{ margin: '3rem 0', textAlign: 'center' }}>
                  <InputLabel shrink style={{ color: 'white', padding: '-10px -10px', margin: '-10px' }}>
                    Bio
                  </InputLabel>
                  <Field
                    name="bio"
                    as={TextField}
                    multiline
                    rows={3}
                    InputProps={{ style: { color: 'white' } }}
                    style={{ color: 'white' }}
                  />
                </FormControl>
                <Button type="submit" variant="contained" style={{ backgroundColor: 'rgba(0, 100, 0, 0.7)', color: 'white', marginTop: '1rem' }} disabled={isSubmitting}>Save</Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>

    </Main>
  );
}

export default ProfilePage;
