import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import mixpanel from 'mixpanel';

const mixpanelToken = process.env.MIXPANEL_PROJECT_TOKEN;
const mp = mixpanel.init(mixpanelToken || '');

export interface MixpanelEvent {
  name: string;
  distinctId: string;
  additionalProperties?: object;
}

@injectable({scope: BindingScope.TRANSIENT})
export class MixpanelService {
  constructor(/* Add @inject to inject parameters */) {}

  trackEvent(event: MixpanelEvent) {
    // track an event
    mp.track(event.name, {
      distinct_id: event.distinctId,
      ...event.additionalProperties,
    });
  }
}
