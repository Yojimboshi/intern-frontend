// src\pages\apps\hierarchy\index.tsx
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardSnippet from 'src/@core/components/card-snippet'
import TreeViewRichObject from 'src/views/apps/hierarchy/TreeViewRichObject'

const TreeView = () => {
  return (
    <Grid container spacing={6} className='match-height'>
      <Grid item>
        <CardSnippet
          title='Binary Tree'
          code={{
            tsx: null,
            jsx: null
          }}
        >
          <Typography sx={{ mb: 4 }}>
            You can view <code>users</code> and <code>add users</code> by clicking on username below, or pressing the '+' sign.
          </Typography>
          <TreeViewRichObject />
        </CardSnippet>
      </Grid>
    </Grid>
  )
}

export default TreeView
