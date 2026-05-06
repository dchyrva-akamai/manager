/**
 * @file Cypress intercepts and mocks for Cloud Manager Object Storage operations.
 */

import { sequentialStub } from 'support/stubs/sequential-stub';
import { makeErrorResponse } from 'support/util/errors';
import { apiMatcher } from 'support/util/intercepts';
import { paginateResponse } from 'support/util/paginate';
import { makeResponse } from 'support/util/response';

import { objectStorageBucketFactoryGen2 } from 'src/factories';

import type { Quota, QuotaUsage } from '@linode/api-v4';
import type {
  ObjectStorageBucket,
  ObjectStorageBucketAccess,
  ObjectStorageEndpoint,
  ObjectStorageKey,
  PriceType,
} from '@linode/api-v4';
/**
 * Intercepts GET requests to fetch buckets.
 *
 * @returns Cypress chainable.
 */
export const interceptGetBuckets = (): Cypress.Chainable<null> => {
  return cy.intercept('GET', apiMatcher('object-storage/buckets/*'));
};

/**
 * Intercepts GET requests to fetch buckets and mocks response.
 *
 * Only returns data for the first request intercepted.
 *
 * @param buckets - Object storage buckets with which to mock response.
 *
 * @returns Cypress chainable.
 */
export const mockGetBuckets = (
  buckets: ObjectStorageBucket[]
): Cypress.Chainable<null> => {
  /*
   * Only the first mocked response will contain data. Subsequent responses
   * will contain an empty array.
   *
   * This is necessary because the Object Storage Buckets landing page makes
   * an indeterminate number of requests to `/object-storage/buckets/<region>`,
   * where `<region>` may be any region where Object Storage is supported.
   */
  return cy.intercept(
    'GET',
    apiMatcher('object-storage/buckets/*'),
    sequentialStub([paginateResponse(buckets), paginateResponse([])])
  );
};

/**
 * Intercepts GET requests to fetch object-storage types and mocks response.
 *
 * Only returns data for the first request intercepted.
 *
 * @param priceTypes - Object storage buckets with which to mock response.
 *
 * @returns Cypress chainable.
 */
export const mockGetObjectStorageTypes = (
  priceTypes: PriceType[]
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher('object-storage/types*'),
    paginateResponse(priceTypes)
  );
};

/**
 * Intercepts GET request to fetch buckets for a region and mocks response.
 *
 * @param regionId - ID of region for which to mock buckets.
 * @param buckets - Array of Bucket objects with which to mock response.
 *
 * @returns Cypress chainable.
 */
export const mockGetBucketsForRegion = (
  regionId: string,
  buckets: ObjectStorageBucket[]
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher(`object-storage/buckets/${regionId}*`),
    paginateResponse(buckets)
  );
};

/**
 * Intercepts POST request to create a bucket and mocks an error response.
 *
 * @param regionId - Region for which to mock buckets.
 * @param errorMessage - Optional error message with which to mock response.
 * @param statusCode - HTTP status code with which to mock response.
 *
 * @returns Cypress chainable.
 */
export const mockGetBucketsForRegionError = (
  regionId: string,
  errorMessage: string = 'An unknown error occurred.',
  statusCode: number = 500
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher(`object-storage/buckets/${regionId}*`),
    makeErrorResponse(errorMessage, statusCode)
  );
};

/**
 * Intercepts POST request to create bucket.
 *
 * @returns Cypress chainable.
 */
export const interceptCreateBucket = (): Cypress.Chainable<null> => {
  return cy.intercept('POST', apiMatcher('object-storage/buckets'));
};

/**
 * Intercepts POST request to create a bucket and mocks response.
 *
 * @param bucket - Bucket with which to mock response.
 *
 * @returns Cypress chainable.
 */
export const mockCreateBucket = (
  bucket?: Partial<ObjectStorageBucket>
): Cypress.Chainable<null> => {
  return cy.intercept(
    'POST',
    apiMatcher('object-storage/buckets'),
    makeResponse(objectStorageBucketFactoryGen2.build(bucket))
  );
};

/**
 * Intercepts POST request to create a bucket and mocks an error response.
 *
 * @param errorMessage - Optional error message with which to mock response.
 * @param statusCode - HTTP status code with which to mock response.
 *
 * @returns Cypress chainable.
 */
export const mockCreateBucketError = (
  errorMessage: string = 'An unknown error occurred.',
  statusCode: number = 500
): Cypress.Chainable<null> => {
  return cy.intercept(
    'POST',
    apiMatcher('object-storage/buckets'),
    makeErrorResponse(errorMessage, statusCode)
  );
};

/**
 * Intercepts DELETE request to delete bucket.
 *
 * If a bucket label and regionId are provided, only requests to delete the
 * given bucket in the given regionId are intercepted.
 *
 * If only a regionId is provided, only requests to delete buckets in the
 * given regionId are intercepted.
 *
 * If no regionId or label are provided, all requests to delete buckets are
 * intercepted.
 *
 * @param bucketName - Optional bucket name for bucket deletion to intercept.
 * @param regionId - Optional regionId for bucket deletion to intercept.
 *
 * @returns Cypress chainable.
 */
export const interceptDeleteBucket = (
  bucketName?: string,
  regionId?: string
): Cypress.Chainable<null> => {
  if (bucketName && regionId) {
    return cy.intercept(
      'DELETE',
      apiMatcher(`object-storage/buckets/${regionId}/${bucketName}`)
    );
  }
  if (regionId) {
    return cy.intercept(
      'DELETE',
      apiMatcher(`object-storage/buckets/${regionId}/*`)
    );
  }
  return cy.intercept('DELETE', apiMatcher('object-storage/buckets/*'));
};

/**
 * Intercepts DELETE request to delete bucket and mocks response.
 *
 * @param bucketName - Object storage bucket name (label).
 * @param regionId - Region with Object Storage capability.
 * @param statusCode - HTTP status code with which to mock response, 200 as default.
 *
 * @returns Cypress chainable.
 */
export const mockDeleteBucket = (
  bucketName: string,
  regionId: string,
  statusCode: number = 200
): Cypress.Chainable<null> => {
  return cy.intercept(
    'DELETE',
    apiMatcher(`object-storage/buckets/${regionId}/${bucketName}`),
    {
      body: {},
      statusCode,
    }
  );
};

/**
 * Intercepts GET request to fetch bucket objects and mocks response.
 *
 * @param bucketName - Object storage bucket name (label).
 * @param regionId - Region with Object Storage capability.
 * @param data - Mocked response data.
 * @param statusCode - Mocked response status code.
 *
 * @returns Cypress chainable.
 */
export const mockGetBucketObjects = (
  bucketName: string,
  regionId: string,
  data: any,
  statusCode: number = 200
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher(
      `object-storage/buckets/${regionId}/${bucketName}/object-list?delimiter=%2F&prefix=`
    ),
    {
      body: {
        data,
        is_truncated: false,
        next_marker: null,
      },
      statusCode,
    }
  );
};

/**
 * Intercepts POST request to upload bucket object and mocks response.
 *
 * By default, an HTTP 200 response which contains the S3 URL for the object
 * is mocked.
 *
 * @param bucketName - Object storage bucket name (label).
 * @param objClusterId - The ID of the actual OBJ cluster for the bucket.
 * @param filename - Mocked response object filename.
 * @param data - Optional mocked response data.
 * @param statusCode - Opiontal mocked response status code.
 *
 * @returns Cypress chainable.
 */
export const mockUploadBucketObject = (
  bucketName: string,
  objClusterId: string,
  filename: string,
  data?: any,
  statusCode: number = 200
): Cypress.Chainable<null> => {
  const mockResponse = {
    body: data || {
      exists: false,
      url: `https://${objClusterId}.linodeobjects.com:443/${bucketName}/${filename}`,
    },
    statusCode,
  };

  return cy.intercept(
    'POST',
    apiMatcher(
      `object-storage/buckets/${objClusterId}/${bucketName}/object-url`
    ),
    mockResponse
  );
};

/**
 * Intercepts S3 PUT request to upload bucket object.
 *
 * @param bucketName - Object storage bucket name.
 * @param domain - Object storage domain.
 * @param filename - Object filename.
 *
 * @returns Cypress chainable.
 */
export const interceptUploadBucketObjectS3 = (
  bucketName: string,
  domain: string,
  filename: string
): Cypress.Chainable<null> => {
  return cy.intercept('PUT', `https://${domain}/${bucketName}/${filename}*`);
};

/**
 * Intercepts S3 PUT request to upload bucket object and mocks response.
 *
 * @param bucketName - Object storage bucket label.
 * @param objClusterId - The ID of the actual OBJ cluster for the bucket.
 * @param filename - Object filename.
 *
 * @returns Cypress chainable.
 */
export const mockUploadBucketObjectS3 = (
  bucketName: string,
  objClusterId: string,
  filename: string
): Cypress.Chainable<null> => {
  return cy.intercept(
    'PUT',
    `https://${objClusterId}.linodeobjects.com/${bucketName}/${filename}*`,
    {}
  );
};

/**
 * Intercepts POST request to create an object URL and mocks response.
 *
 * @param bucketName - Object storage bucket name (label).
 * @param regionId - Region with Object Storage capability.
 * @param filename - Object filename.
 *
 * @returns Cypress chainable.
 */
export const mockCreateObjectUrl = (
  bucketName: string,
  regionId: string,
  filename: string
): Cypress.Chainable<null> => {
  return cy.intercept(
    'POST',
    apiMatcher(`object-storage/buckets/${regionId}/${bucketName}/object-url`),
    {
      exists: true,
      url: `https://${regionId}-1.linodeobjects.com:443/${bucketName}/${filename}`,
    }
  );
};

/**
 * Intercepts S3 DELETE request to delete bucket object and mocks response.
 *
 * @param label - Object storage bucket label.
 * @param objClusterId - The ID of the actual OBJ cluster for the bucket.
 * @param filename - Object filename.
 * @param status - Response status.
 *
 * @returns Cypress chainable.
 */
export const mockDeleteBucketObjectS3 = (
  label: string,
  objClusterId: string,
  filename: string,
  status: number = 204
): Cypress.Chainable<null> => {
  return cy.intercept(
    'DELETE',
    `https://${objClusterId}.linodeobjects.com/${label}/${filename}*`,
    {
      statusCode: status,
    }
  );
};

/**
 * Intercepts GET request to fetch object storage access keys.
 *
 * @returns Cypress chainable.
 */
export const interceptGetAccessKeys = (): Cypress.Chainable<null> => {
  return cy.intercept('GET', apiMatcher('object-storage/keys*'));
};

/**
 * Intercepts GET request to fetch object storage access keys, and mocks response.
 *
 * @param accessKeys - Mocked response.
 *
 * @returns Cypress chainable.
 */
export const mockGetAccessKeys = (
  accessKeys: ObjectStorageKey[]
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher('object-storage/keys*'),
    paginateResponse(accessKeys)
  );
};

/**
 * Intercepts object storage access key POST request.
 *
 * @returns Cypress chainable.
 */
export const interceptCreateAccessKey = (): Cypress.Chainable<null> => {
  return cy.intercept('POST', apiMatcher('object-storage/keys'));
};

/**
 * Intercepts object storage access key POST request and mocks response.
 *
 * @param accessKey - Access key with which to mock response.
 *
 * @returns Cypress chainable.
 */
export const mockCreateAccessKey = (
  accessKey: ObjectStorageKey
): Cypress.Chainable<null> => {
  return cy.intercept(
    'POST',
    apiMatcher('object-storage/keys'),
    makeResponse(accessKey)
  );
};

/**
 * Intercepts request to update an Object Storage Access Key and mocks response.
 *
 * @param updatedAccessKey - Access key with which to mock response.
 *
 * @returns Cypress chainable.
 */
export const mockUpdateAccessKey = (
  updatedAccessKey: ObjectStorageKey
): Cypress.Chainable<null> => {
  return cy.intercept(
    'PUT',
    apiMatcher(`object-storage/keys/${updatedAccessKey.id}`),
    makeResponse(updatedAccessKey)
  );
};

/**
 * Intercepts object storage access key DELETE request and mocks success response.
 *
 * @param keyId - ID of access key for which to intercept DELETE request.
 *
 * @returns Cypress chainable.
 */
export const mockDeleteAccessKey = (keyId: number): Cypress.Chainable<null> => {
  return cy.intercept('DELETE', apiMatcher(`object-storage/keys/${keyId}`), {
    body: {},
    statusCode: 200,
  });
};

/**
 * Intercepts POST request to cancel Object Storage and mocks response.
 *
 * @returns Cypress chainable.
 */
export const mockCancelObjectStorage = (): Cypress.Chainable => {
  return cy.intercept('POST', apiMatcher('object-storage/cancel'), {});
};

/**
 * Intercepts GET request to fetch access information (ACL, CORS) for a given Bucket.
 *
 * @param bucketName - Object storage bucket name (label).
 * @param regionId - Region with Object Storage capability.
 *
 * @returns Cypress chainable.
 */
export const interceptGetBucketAccess = (
  bucketName: string,
  regionId: string
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher(`object-storage/buckets/${regionId}/${bucketName}/access`)
  );
};

/**
 * Intercepts PUT request to update access information (ACL, CORS) for a given Bucket.
 *
 * @param bucketName - Object storage bucket name (label).
 * @param regionId - Region with Object Storage capability.
 *
 * @returns Cypress chainable.
 */
export const interceptUpdateBucketAccess = (
  bucketName: string,
  regionId: string
): Cypress.Chainable<null> => {
  return cy.intercept(
    'PUT',
    apiMatcher(`object-storage/buckets/${regionId}/${bucketName}/access`)
  );
};

/**
 * Intercepts GET request to get object storage endpoints and mocks response.
 *
 * @param endpoints - Object Storage endpoints for which to mock response
 *
 * @returns Cypress chainable.
 */
export const mockGetObjectStorageEndpoints = (
  endpoints: ObjectStorageEndpoint[]
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher(`object-storage/endpoints*`),
    paginateResponse(endpoints)
  );
};

/**
 * Intercepts GET request to fetch access information (ACL, CORS) for a given Bucket and mock the response.
 *
 *
 * @param bucketName - Object storage bucket name.
 * @param regionId - Region with Object Storage capability.
 * @param bucketFilename - uploaded bucketFilename
 *
 * @returns Cypress chainable.
 */
export const mockGetBucketObjectFilename = (
  bucketName: string,
  regionId: string,
  bucketFilename: string
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher(
      `object-storage/buckets/${regionId}/${bucketName}/object-acl?name=${bucketFilename}`
    ),
    {
      body: {},
      statusCode: 200,
    }
  );
};

export const mockGetBucket = (
  bucketName: string,
  regionId: string
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher(`object-storage/buckets/${regionId}/${bucketName}`),
    {
      body: {},
      statusCode: 200,
    }
  );
};

/* Intercepts GET request to fetch access information (ACL, CORS) for a given Bucket, and mocks response.
 *
 * @param label - Object storage bucket label.
 * @param regionId - Region with Object Storage capability.
 * @param bucketAccess - Access details for which to mock the response
 *
 * @returns Cypress chainable.
 */
export const mockGetBucketAccess = (
  bucketName: string,
  regionId: string,
  bucketAccess: ObjectStorageBucketAccess
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher(`object-storage/buckets/${regionId}/${bucketName}/access`),
    makeResponse(bucketAccess)
  );
};

/**
 * Intercepts GET request to get object storage quotas and mocks response.
 *
 * @param endpoint - Endpoint which is included in request's X-Filter header
 * @param quotas - Object Storage quotas for which to mock response
 *
 * @returns Cypress chainable.
 */
export const mockGetObjectStorageQuotas = (
  endpoint: string,
  quotas: Quota[]
): Cypress.Chainable<null> => {
  return cy.intercept('GET', apiMatcher('object-storage/quotas*'), (req) => {
    if (req.headers['x-filter'].includes(`{"s3_endpoint":"${endpoint}"}`)) {
      req.reply(paginateResponse(quotas));
    } else {
      req.continue();
    }
  });
};

export const mockGetObjectStorageQuotaError = (
  errorMessage: string,
  status: number = 500
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher('object-storage/quotas*'),
    makeErrorResponse(errorMessage, status)
  );
};

/**
 * Intercepts GET request to get object storage quota usages and mocks response.
 *
 * @param id - Endpoint which is used as quota identifier
 * @param resource - Resource metric, bytes|buckets|objects
 * @param quotaUsage - Mocked QuotaUsage object
 *
 * @returns Cypress chainable.
 */
export const mockGetObjectStorageQuotaUsages = (
  id: string,
  resource: string,
  quotaUsage: QuotaUsage
): Cypress.Chainable<null> => {
  return cy.intercept(
    'GET',
    apiMatcher(`object-storage/quotas/obj-${resource}-${id}/usage*`),
    makeResponse(quotaUsage)
  );
};
