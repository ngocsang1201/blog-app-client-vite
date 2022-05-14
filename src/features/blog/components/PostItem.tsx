import { BookmarkRemoveRounded, LinkRounded, MoreHorizRounded } from '@mui/icons-material';
import {
  Avatar,
  Box,
  CardMedia,
  IconButton,
  ListItem,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import { ActionMenu } from 'components/common';
import { IMenuItem, IPost } from 'models';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import remarkGfm from 'remark-gfm';
import { copyPostLink, formatTime } from 'utils/common';
import { themeMixins } from 'utils/theme';
import { getErrorMessage } from 'utils/toast';
import { useTranslateFiles } from 'utils/translation';

export interface IPostItemProps {
  post: IPost;
  onUnSave?: (post: IPost) => void;
}

export function PostItem(props: IPostItemProps) {
  const { post, onUnSave } = props;

  const { t } = useTranslation('postItem');
  const { toast: toastTranslation } = useTranslateFiles('toast');

  const [openMenu, setOpenMenu] = useState<boolean>(false);

  const anchorRef = useRef<any>(null);

  const toggleOpenMenu = () => setOpenMenu(!openMenu);
  const closeMenu = () => setOpenMenu(false);

  const handleUnSavePost = async () => {
    try {
      await onUnSave?.(post);
      toast.success(toastTranslation.postItem.unsaveSuccess);
    } catch (error: any) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleMenuItemClick = (callback?: () => void) => {
    closeMenu();
    callback?.();
  };

  const menuItemList: IMenuItem[] = [
    {
      label: t('unsave'),
      icon: BookmarkRemoveRounded,
      onClick: handleUnSavePost,
    },
    {
      label: t('copyLink'),
      icon: LinkRounded,
      onClick: () => copyPostLink(post),
    },
  ];

  return (
    <ListItem
      disablePadding
      sx={{
        my: 2,
        p: 1,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Stack width="100%" alignItems="center">
        <Box flexShrink={0} component={Link} to={`/blog/post/${post.slug}`}>
          <CardMedia
            image={post.thumbnail}
            sx={{
              height: { xs: 80, sm: 100 },
              aspectRatio: { xs: '1', sm: '2' },
              mr: 2,
              bgcolor: 'action.hover',
              borderRadius: 2,
            }}
          >
            <Box />
          </CardMedia>
        </Box>

        <Stack direction="column" flexGrow={1} justifyContent="center">
          <Typography
            color="text.primary"
            fontSize={{ sx: 16, sm: 20 }}
            fontWeight={500}
            sx={{ ...themeMixins.truncate(1) }}
            component={Link}
            to={`/blog/post/${post.slug}`}
          >
            {post.title}
          </Typography>

          <Typography variant="body2" fontSize={12} color="text.secondary">
            {post.author?.name}
          </Typography>

          <Typography variant="body2" fontSize={12} color="text.secondary">
            {formatTime(post.createdAt)}
          </Typography>
        </Stack>

        <Box flexShrink={0} ml={2}>
          <IconButton
            size="small"
            ref={anchorRef}
            onClick={toggleOpenMenu}
            disableRipple={false}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              },
            }}
          >
            <MoreHorizRounded />
          </IconButton>

          <ActionMenu open={openMenu} anchorEl={anchorRef.current} onClose={closeMenu}>
            {menuItemList.map(({ label, icon: Icon, onClick }, idx) => (
              <MenuItem
                key={idx}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  fontSize: 15,
                }}
                onClick={() => handleMenuItemClick(onClick)}
              >
                <Icon sx={{ fontSize: 20, mr: 2 }} />
                {label}
              </MenuItem>
            ))}
          </ActionMenu>
        </Box>
      </Stack>
    </ListItem>
  );
}
