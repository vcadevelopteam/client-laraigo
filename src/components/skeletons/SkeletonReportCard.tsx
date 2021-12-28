import { Skeleton } from '@material-ui/lab';

const ListInteractionSkeleton: React.FC = () => (
    <div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <Skeleton animation="wave" width={330} variant="rect" height={200} />
            <Skeleton animation="wave" width={330} variant="rect" height={200} />
            <Skeleton animation="wave" width={330} variant="rect" height={200} />
            <Skeleton animation="wave" width={330} variant="rect" height={200} />
            <Skeleton animation="wave" width={330} variant="rect" height={200} />
            <Skeleton animation="wave" width={330} variant="rect" height={200} />
            <Skeleton animation="wave" width={330} variant="rect" height={200} />
            <Skeleton animation="wave" width={330} variant="rect" height={200} />
            <Skeleton animation="wave" width={330} variant="rect" height={200} />
        </div>
    </div>
)

export default ListInteractionSkeleton