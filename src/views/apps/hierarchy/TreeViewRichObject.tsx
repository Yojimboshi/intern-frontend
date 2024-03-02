// src\views\components\tree-view\TreeViewRichObject.tsx
import axios from 'src/configs/axiosConfig';
import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button'
import { useTheme, darken } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip'
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid'
import AddChildDrawer from 'src/views/apps/hierarchy/AddChildDrawer'
import Icon from 'src/@core/components/icon'
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton'

interface UserNode {
  id: number;
  username: string;
  leftChildId: number | null;
  rightChildId: number | null;
  leftChild?: UserNode;
  rightChild?: UserNode;
  rightCarryForward?: number | 0;
  leftCarryForward?: number | 0;
}

const TreeViewRichObject = () => {
  const [firstUser, setFirstUser] = useState<UserNode | null>(null);
  const [children, setChildren] = useState<(UserNode | null)[]>([]);
  const [history, setHistory] = useState<{ firstUser: UserNode | null, children: (UserNode | null)[] }[]>([]);
  const [isAddUserDrawerOpen, setIsAddUserDrawerOpen] = useState(false);
  const [addChildInfo, setAddChildInfo] = useState<{ position?: 'left' | 'right', parentUsername: string }>({
    position: undefined,
    parentUsername: ''
  });
  const theme = useTheme();

  const isMobile = useMediaQuery('(max-width:600px)'); // Adjust the max-width as needed

  const truncateUsername = (username: string) => {
    return isMobile && username.length > 6 ? `${username.substring(0, 5)}...` : username;
  };

  const toggleAddUserDrawer = () => setIsAddUserDrawerOpen(!isAddUserDrawerOpen);

  const colors = {
    primaryDark: theme.palette.primary.dark, // Darker primary color
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    secondaryLight: theme.palette.secondary.light,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    success: theme.palette.success.main,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/users/children')
        console.log('API Response:', response.data);
        const { user, children, grandchildren } = response.data;
        const userArray: UserNode[] = [user];
        const structuredChildren: (UserNode | null)[] = [
          children.find((child: UserNode) => child.id === user.leftChildId) || null,
          children.find((child: UserNode) => child.id === user.rightChildId) || null,
        ];
        linkChildUsernames(userArray, children);
        setFirstUser(userArray[0]);
        linkChildUsernames(structuredChildren.filter((child): child is UserNode => child !== null), grandchildren);
        setChildren(structuredChildren);
        setHistory([{ firstUser, children }]);
      } catch (error) {
        console.error('There was an error fetching the tree data:', error)
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function linkChildUsernames(parentArray: UserNode[], childArray: UserNode[]) {
    parentArray.forEach(parent => {

      // Link left child
      if (parent.leftChildId !== null) {
        const leftChild = childArray.find(child => child.id === parent.leftChildId);
        if (leftChild) {
          parent.leftChild = leftChild;
        }
      }

      // Link right child
      if (parent.rightChildId !== null) {
        const rightChild = childArray.find(child => child.id === parent.rightChildId);
        if (rightChild) {
          parent.rightChild = rightChild;
        }
      }
    });

    return parentArray;
  }


  const handleNodeSelect = async (selectedUserId: number) => {
    console.log("handleNodeSelect called with ID:", selectedUserId);
    setHistory(prevHistory => [...prevHistory, { firstUser, children }]);
    try {
      const response = await axios.get('/users/children', { params: { userId: selectedUserId } });
      const { user, children, grandchildren } = response.data;
      const userArray = [user];
      const structuredChildren: (UserNode | null)[] = [
        children.find((child: UserNode) => child.id === user.leftChildId) || null,
        children.find((child: UserNode) => child.id === user.rightChildId) || null,
      ];
      linkChildUsernames(userArray, children);
      linkChildUsernames(structuredChildren.filter((child): child is UserNode => child !== null), grandchildren);
      setFirstUser(userArray[0]);
      setChildren(structuredChildren);
    } catch (error) {
      console.error('Error fetching child nodes:', error);
    }
    console.log("history", history);
  };

  const handleAddChild = (position: 'left' | 'right', parentUsername: string) => {
    setAddChildInfo({ position, parentUsername });
    setIsAddUserDrawerOpen(true);
  };

  const handleUndo = () => {
    setHistory(prevHistory => {
      if (prevHistory.length === 1) {

        return prevHistory;
      }

      const lastState = prevHistory[prevHistory.length - 1];

      setFirstUser(lastState.firstUser);
      setChildren(lastState.children);

      // Remove the last state from the history
      return prevHistory.slice(0, prevHistory.length - 1);
    });
  };

  if (!firstUser) return <div>Loading...</div>;

  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridAutoRows: 'minmax(50px, auto)',
        gap: '10px',
        minHeight: '200px',
        alignItems: 'center', // Center items vertically
      }}
    >
      <Button variant='contained'
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}
        onClick={handleUndo}
      >
        Back
      </Button>

      {/* Row 1: Parent */}
      <Tooltip
        title={`Left Carry Forward: ${firstUser.leftCarryForward}, Right Carry Forward: ${firstUser.rightCarryForward}`}
        arrow
        placement="bottom"
        sx={{
          typography: 'body2',
          borderRadius: '4px',
          p: 1, // Padding shorthand for theme spacing
        }}
      >
        <div style={{
          gridColumn: '4 / span 2',
          gridRow: '1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }} >
          <Icon
            icon='mdi:account-circle'
            style={{
              fontSize: '24px',
              marginRight: '8px',
              color: colors.primaryDark
            }}
          />
          {firstUser && <span style={{ color: colors.primaryDark }}>{firstUser.username}</span>}
        </div>
      </Tooltip>

      {/* Row 2: Lines*/}
      {(
        <div style={{
          gridColumn: `3 / ${3 + 4}`,
          gridRow: '2',
          borderBottom: `5px solid ${colors.secondaryLight}`, // Apply primary color to line
          zIndex: 1
        }}></div>

      )}

      {/* Row 3: Children */}
      {/* Left Child */}
      <div style={{ gridColumn: '2 / span 2', gridRow: '3', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {firstUser.leftChild ? (
          <Tooltip
            title={`Left Carry Forward: ${firstUser.leftChild.leftCarryForward}, Right Carry Forward: ${firstUser.leftChild?.rightCarryForward}`} // Assuming you have a leftChild's rightCarryForward
            arrow
            placement="bottom"
            sx={{
              typography: 'body2',
              borderRadius: '4px',
              p: 1,
            }}
          >
            <span style={{ color: colors.primary }} onClick={() => firstUser.leftChildId != null ? handleNodeSelect(firstUser.leftChildId) : undefined}>
              {firstUser.leftChild.username}
            </span>
          </Tooltip>
        ) : (
          <IconButton onClick={() => handleAddChild('left', firstUser.username)}>
            <Icon icon="gg:add" />
          </IconButton>
        )}
      </div>
      {/* Right Child */}
      <div style={{ gridColumn: '6 / span 2', gridRow: '3', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {firstUser.rightChild ? (
          <Tooltip
            title={`Left Carry Forward: ${firstUser.rightChild.leftCarryForward}, Right Carry Forward: ${firstUser.rightChild.rightCarryForward}`}
            arrow
            placement="bottom"
            sx={{
              typography: 'body2',
              borderRadius: '4px',
              p: 1,
            }}
          >
            <span style={{ color: colors.primary }} onClick={() => firstUser.rightChildId != null ? handleNodeSelect(firstUser.rightChildId) : undefined}>
              {firstUser.rightChild.username}
            </span>
          </Tooltip>
        ) : (
          <IconButton onClick={() => handleAddChild('right', firstUser.username)}>
            <Icon icon="gg:add" />
          </IconButton>
        )}
      </div>

      {/* Row 4: Lines to link to grandchildren */}
      {firstUser.leftChildId && (
        <div style={{
          gridColumn: '2 / span 2',
          gridRow: '4',
          borderBottom: `5px solid ${colors.secondary}`,
          zIndex: 1
        }}></div>
      )}
      {firstUser.rightChildId && (
        <div style={{
          gridColumn: '6 / span 2',
          gridRow: '4',
          borderBottom: `5px solid ${colors.secondary}`,
          zIndex: 1
        }}></div>
      )}

      {/* Row 5: Grandchildren */}
      {/* Left Child's Left Grandchild */}
      <div style={{
        gridColumn: '1 / span 2',
        gridRow: '5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {children[0]?.leftChild ? (
          <Tooltip
            title={`Left Carry Forward: ${children[0]?.leftChild?.leftCarryForward},
            Right Carry Forward: ${children[0]?.leftChild?.rightCarryForward}`}
            arrow
            placement="bottom"
            sx={{
              typography: 'body2',
              backgroundColor: (theme) => darken(theme.palette.secondary.main, 0.7),
              color: (theme) => theme.palette.common.white,
              borderRadius: '4px',
              p: 1,
            }}
          >
            <div style={{
              gridColumn: '1 / span 2',
              gridRow: '5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <span style={{ color: colors.primary }} onClick={() => children[0]?.leftChildId ? handleNodeSelect(children[0].leftChildId) : undefined}>
                {truncateUsername(children[0].leftChild.username)}
              </span>
            </div>
          </Tooltip>
        ) : (
          children[0] && (
            <IconButton onClick={() => handleAddChild('left', children[0]!.username)}>
              <Icon icon="gg:add" />
            </IconButton>
          )
        )}
      </div>
      {/* Left Child's Right Grandchild */}
      <div style={{
        gridColumn: '3 / span 2',
        gridRow: '5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {children[0]?.rightChild ? (
          <Tooltip
            title={`Left Carry Forward: ${children[0]?.rightChild?.leftCarryForward}, Right Carry Forward: ${children[0]?.rightChild?.rightCarryForward}`}
            arrow
            placement="bottom"
            sx={{
              typography: 'body2',
              backgroundColor: (theme) => darken(theme.palette.secondary.main, 0.7),
              color: (theme) => theme.palette.common.white,
              borderRadius: '4px',
              p: 1,
            }}
          >
            <div style={{
              gridColumn: '3 / span 2',
              gridRow: '5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <span style={{ color: colors.primary }} onClick={() => children[0]?.rightChildId ? handleNodeSelect(children[0].rightChildId) : undefined}>
                {truncateUsername(children[0].rightChild.username)}
              </span>
            </div>
          </Tooltip>
        ) : (
          children[0] && (
            <IconButton onClick={() => handleAddChild('right', children[0]!.username)}>
              <Icon icon="gg:add" />
            </IconButton>
          )
        )}
      </div>
      {/* Right Child's Left Grandchild */}
      <div style={{
        gridColumn: '5 / span 2',
        gridRow: '5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {children[1]?.leftChild ? (
          <Tooltip
            title={`Left Carry Forward: ${children[1]?.leftChild?.leftCarryForward}, Right Carry Forward: ${children[1]?.leftChild?.rightCarryForward}`}
            arrow
            placement="bottom"
            sx={{
              typography: 'body2',
              backgroundColor: (theme) => darken(theme.palette.secondary.main, 0.7),
              color: (theme) => theme.palette.common.white,
              borderRadius: '4px',
              p: 1,
            }}
          >
            <div style={{
              gridColumn: '5 / span 2',
              gridRow: '5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <span style={{ color: colors.primary }} onClick={() => children[1]?.leftChildId ? handleNodeSelect(children[1].leftChildId) : undefined}>
                {truncateUsername(children[1].leftChild.username)}
              </span>
            </div>
          </Tooltip>
        ) : (
          children[1] && (
            <IconButton onClick={() => handleAddChild('left', children[1]!.username)}>
              <Icon icon="gg:add" />
            </IconButton>
          )
        )}
      </div>
      {/* Right Child's Right Grandchild */}
      <div style={{
        gridColumn: '7 / span 2',
        gridRow: '5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {children[1]?.rightChild ? (
          <Tooltip
            title={`Left Carry Forward: ${children[1]?.rightChild?.leftCarryForward}, Right Carry Forward: ${children[1]?.rightChild?.rightCarryForward}`}
            arrow
            placement="bottom"
            sx={{
              typography: 'body2',
              backgroundColor: (theme) => darken(theme.palette.secondary.main, 0.7),
              color: (theme) => theme.palette.common.white,
              borderRadius: '4px',
              p: 1,
            }}
          >
            <div style={{
              gridColumn: '7 / span 2',
              gridRow: '5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <span style={{ color: colors.primary }} onClick={() => children[1]?.rightChildId ? handleNodeSelect(children[1].rightChildId) : undefined}>
                {truncateUsername(children[1].rightChild.username)}
              </span>
            </div>
          </Tooltip>
        ) : (
          children[1] && (
            <IconButton onClick={() => handleAddChild('right', children[1]!.username)}>
              <Icon icon="gg:add" />
            </IconButton>
          )
        )}
      </div>

      <AddChildDrawer
        open={isAddUserDrawerOpen}
        toggle={toggleAddUserDrawer}
        position={addChildInfo.position} // No error should occur here
        parentUsername={addChildInfo.parentUsername}
        handleNodeSelect={() => handleNodeSelect(firstUser?.id)}
      />

    </div >
  );
};

export default TreeViewRichObject
