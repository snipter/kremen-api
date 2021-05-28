#! /bin/sh

tee ./web/deputies/.env.dev <<EOF
ENV=dev
MAPS_API_KEY=AIzaSyB4xsXg0kWF8F6ey5Y8h44b1JekESaVCIg
EOF

tee ./web/deputies/.env.prd <<EOF
ENV=prd
MAPS_API_KEY=AIzaSyCDfFyXGQFPxVk813wgyIOiRvOu9f3Nvno
EOF

tee ./web/equipment/.env.dev <<EOF
ENV=dev
MAPS_API_KEY=AIzaSyCchqTaGYBcoeQhgw11_GeTrh533dvPFpQ
EOF

tee ./web/equipment/.env.loc <<EOF
ENV=loc
MAPS_API_KEY=AIzaSyCchqTaGYBcoeQhgw11_GeTrh533dvPFpQ
EOF

tee ./web/equipment/.env.prd <<EOF
ENV=prd
MAPS_API_KEY=AIzaSyAziRMpHFIzoqER9331LMYKAr3VtHYihxA
EOF

tee ./web/transport/.env.demo <<EOF
ENV=prd
MAPS_API_KEY=AIzaSyCJndeCrMk6tKzyvR0O2Q_dnOvBUqdJpJ4
EOF

tee ./web/transport/.env.dev <<EOF
ENV=dev
MAPS_API_KEY=AIzaSyBOW1Al_t2whGurhp07c-tNEC0wibl16Fs
EOF

tee ./web/transport/.env.loc <<EOF
ENV=loc
MAPS_API_KEY=AIzaSyBOW1Al_t2whGurhp07c-tNEC0wibl16Fs
EOF

tee ./web/transport/.env.prd <<EOF
ENV=prd
MAPS_API_KEY=AIzaSyCJndeCrMk6tKzyvR0O2Q_dnOvBUqdJpJ4
EOF