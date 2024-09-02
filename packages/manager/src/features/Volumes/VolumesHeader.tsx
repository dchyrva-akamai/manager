import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { useHistory } from 'react-router-dom';
import { debounce } from 'throttle-debounce';

import { CircleProgress } from 'src/components/CircleProgress';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { IconButton } from 'src/components/IconButton';
import { InputAdornment } from 'src/components/InputAdornment';
import { LandingHeader } from 'src/components/LandingHeader';
import { TextField } from 'src/components/TextField';
import { getRestrictedResourceText } from 'src/features/Account/utils';
import { useRestrictedGlobalGrantCheck } from 'src/hooks/useRestrictedGlobalGrantCheck';

interface Params {
  isFetching: boolean;
  searchQueryKey: string;
  volumeLabelFromParam: string;
}

export function VolumesHeader({
  isFetching,
  searchQueryKey,
  volumeLabelFromParam,
}: Params) {
  const history = useHistory();
  const queryParams = new URLSearchParams(location.search);

  const isRestricted = useRestrictedGlobalGrantCheck({
    globalGrantType: 'add_volumes',
  });

  const resetSearch = () => {
    queryParams.delete(searchQueryKey);
    history.push({ search: queryParams.toString() });
  };

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    queryParams.delete('page');
    queryParams.set(searchQueryKey, e.target.value);
    history.push({ search: queryParams.toString() });
  };

  return (
    <>
      <DocumentTitleSegment segment="Volumes" />
      <LandingHeader
        breadcrumbProps={{
          pathname: location.pathname,
          removeCrumbX: 1,
        }}
        buttonDataAttrs={{
          tooltipText: getRestrictedResourceText({
            action: 'create',
            isSingular: false,
            resourceType: 'Volumes',
          }),
        }}
        disabledCreateButton={isRestricted}
        docsLink="https://www.linode.com/docs/platform/block-storage/how-to-use-block-storage-with-your-linode/"
        entity="Volume"
        onButtonClick={() => history.push('/volumes/create')}
        title="Volumes"
      />
      <TextField
        InputProps={{
          endAdornment: volumeLabelFromParam && (
            <InputAdornment position="end">
              {isFetching && <CircleProgress size="sm" />}

              <IconButton
                aria-label="Clear"
                data-testid="clear-volumes-search"
                onClick={resetSearch}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        onChange={debounce(400, (e) => {
          onSearch(e);
        })}
        hideLabel
        label="Search"
        placeholder="Search Volumes"
        sx={{ mb: 2 }}
        value={volumeLabelFromParam}
      />
    </>
  );
}
