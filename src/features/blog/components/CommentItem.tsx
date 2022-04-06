import { DeleteRounded, FavoriteRounded, FlagRounded, MoreHorizRounded } from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  ListItem,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { useAppSelector } from 'app/hooks';
import { ActionMenu } from 'components/common';
import { selectCurrentUser } from 'features/auth/authSlice';
import { Comment, IMenuItem } from 'models';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { formatTime } from 'utils/common';

export interface CommentItemProps {
  comment: Comment;
  onRemove?: (comment: Comment) => void;
  onLike?: (comment: Comment) => void;
}

export default function CommentItem({ comment, onRemove, onLike }: CommentItemProps) {
  const { t } = useTranslation('postComment');

  const currentUser = useAppSelector(selectCurrentUser);

  const anchorRef = useRef<HTMLElement | null>(null);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const toggleMenu = () => setOpenMenu(!openMenu);
  const closeMenu = () => setOpenMenu(false);
  const closeDialog = () => setOpenDialog(false);

  const handleRemoveComment = async () => {
    setLoading((prevState) => true);

    try {
      await onRemove?.(comment);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    }

    setLoading((prevState) => false);
  };

  const confirmRemoveComment = () => {
    closeMenu();
    setOpenDialog(true);
  };

  const handleLikeComment = () => {
    onLike?.(comment);
  };

  const isAuthorized = currentUser?._id === comment.userId || currentUser?.role === 'admin';
  const menuItems: IMenuItem[] = [
    {
      label: t('menu.delete'),
      icon: DeleteRounded,
      onClick: confirmRemoveComment,
      active: isAuthorized,
    },
    {
      label: t('menu.report'),
      icon: FlagRounded,
      onClick: () => {},
      active: true,
    },
  ];

  return (
    <>
      <ListItem disableGutters sx={{ mb: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs="auto">
            <Avatar src={comment?.user?.avatar} sx={{ width: 36, height: 36 }} />
          </Grid>

          <Grid item xs>
            <Badge
              color="primary"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              invisible={!comment?.likes?.length}
              sx={{
                '& .MuiBadge-badge': {
                  bottom: 2,
                  right: 6,
                  py: 1.5,
                  pl: 0.3,
                  pr: 0.5,
                  bgcolor: 'background.paper',
                  borderRadius: 5,
                  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                },
              }}
              badgeContent={
                <Stack direction="row" alignItems="center" p={0.3}>
                  <FavoriteRounded sx={{ color: 'primary.main', fontSize: 18 }} />

                  <Typography variant="subtitle2" color="text.primary" ml={0.5}>
                    {comment?.likes?.length || 0}
                  </Typography>
                </Stack>
              }
            >
              <Box
                sx={{
                  position: 'relative',
                  width: 'fit-content',
                  py: 1,
                  px: 2,
                  bgcolor: 'action.hover',
                  borderRadius: 4,
                }}
              >
                <Typography variant="subtitle2" color="text.primary" fontWeight="600">
                  {comment?.user?.name}
                </Typography>

                <Typography variant="body1" color="text.primary">
                  {comment.content}
                </Typography>
              </Box>
            </Badge>

            <Stack direction="row" alignItems="center" mt={1}>
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ cursor: 'pointer' }}
                onClick={handleLikeComment}
              >
                {comment?.likes?.includes(currentUser?._id as string) ? t('unlike') : t('like')}
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  color: 'text.secondary',
                  mr: 1,

                  '::before': {
                    width: 2,
                    height: 2,
                    content: '""',
                    bgcolor: 'grey.500',
                    borderRadius: '50%',
                    display: 'block',
                    mx: 1,
                  },
                }}
              >
                {formatTime(comment.createdAt)}
              </Typography>

              <IconButton size="small" disableRipple ref={anchorRef as any} onClick={toggleMenu}>
                <MoreHorizRounded />
              </IconButton>

              <ActionMenu
                open={openMenu}
                anchorEl={anchorRef.current}
                zIndex={(theme) => (theme.zIndex as any).drawer + 1}
                onClose={closeMenu}
              >
                {menuItems.map(({ label, icon: Icon, onClick, active }, idx) =>
                  active ? (
                    <MenuItem
                      key={idx}
                      sx={{
                        py: 1.5,
                        px: 2.5,
                        fontSize: 15,
                      }}
                      onClick={onClick}
                    >
                      <Icon sx={{ mr: 2 }} />
                      {label}
                    </MenuItem>
                  ) : null
                )}
              </ActionMenu>
            </Stack>
          </Grid>
        </Grid>
      </ListItem>

      <Dialog open={openDialog} onClose={closeDialog} sx={{ userSelect: 'none' }}>
        <DialogTitle>{t('dialog.title')}</DialogTitle>

        <Divider />

        <DialogContent>
          <DialogContentText sx={{ color: 'text.primary' }}>
            {t('dialog.content')}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" size="large" disabled={loading} onClick={closeDialog}>
            {t('dialog.button.cancel')}
          </Button>

          <Button
            variant="contained"
            color="error"
            size="large"
            disabled={loading}
            autoFocus
            startIcon={loading && <CircularProgress size={20} />}
            onClick={handleRemoveComment}
          >
            {t('dialog.button.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
