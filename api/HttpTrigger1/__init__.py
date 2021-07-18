import logging, json, httpx
from six.moves.urllib.request import urlopen
from jose import jwt

import azure.functions as func
from typing import Literal


def get_token_auth_header(auth: str) -> str:
    if not auth:
        return 'error'

    parts = auth.split()

    if parts[0].lower() != 'bearer':
        return 'error'

    elif len(parts) == 1 or len(parts) > 2:
        return 'error'

    return parts[1]


def requires_auth(
        req: func.HttpRequest) -> Literal['success'] or Literal['error']:
    token = get_token_auth_header(req.headers.get('Authorization'))
    if token == 'error':
        return 'error'

    # get public key
    jsonurl = urlopen(
        'https://dev-3rae35pa.jp.auth0.com/.well-known/jwks.json')
    jwks = json.loads(jsonurl.read())
    unverified_header = jwt.get_unverified_header(token)
    rsa_key = {}
    for key in jwks["keys"]:
        if key['kid'] == unverified_header['kid']:
            rsa_key = {
                'kty': key['kty'],
                'kid': key['kid'],
                'use': key['use'],
                'n': key['n'],
                'e': key['e']
            }
    if rsa_key:
        try:
            auth = jwt.decode(token,
                              rsa_key,
                              algorithms=['RS256'],
                              audience='api-for-azure-functions',
                              issuer='https://dev-3rae35pa.jp.auth0.com/')
        except Exception:
            return 'error'

        return auth

    return 'error'


# use machine to machine to retrieve user info, which is expensive


def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    auth = requires_auth(req)

    if auth == 'error':
        return func.HttpResponse(status_code=401)

    print('auth', auth)

    # return func.HttpResponse(req.headers,status_code=200)
    return func.HttpResponse(json.dumps({'header': 'cool'}), status_code=200)
