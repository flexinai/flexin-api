/* eslint-disable @typescript-eslint/no-explicit-any */
export const rawToComputed = (input: any) => {
  if (!Array.isArray(input)) {
    return {};
  }
  const raw = input.filter(i => !Object.keys(i).includes('error'));
  const output = {
    raw: {
      frames: raw.length,
      joints: 5,
    },
    total: {
      right: {
        knee: 0,
        elbow: 0,
        ankle: 0,
        hip: 0,
        shoulder: 0,
      },
      left: {
        knee: 0,
        elbow: 0,
        ankle: 0,
        hip: 0,
        shoulder: 0,
      },
    },
    maximum: {
      right: {
        knee: 0,
        elbow: 0,
        ankle: 0,
        hip: 0,
        shoulder: 0,
      },
      left: {
        knee: 0,
        elbow: 0,
        ankle: 0,
        hip: 0,
        shoulder: 0,
      },
    },
    minimum: {
      right: {
        knee: raw[0].right.angles.knee,
        elbow: raw[0].right.angles.elbow,
        ankle: raw[0].right.angles.ankle,
        hip: raw[0].right.angles.hip,
        shoulder: raw[0].right.angles.shoulder,
      },
      left: {
        knee: raw[0].left.angles.knee,
        elbow: raw[0].left.angles.elbow,
        ankle: raw[0].left.angles.ankle,
        hip: raw[0].left.angles.hip,
        shoulder: raw[0].left.angles.shoulder,
      },
    },
    average: {
      right: {
        knee: 0,
        elbow: 0,
        ankle: 0,
        hip: 0,
        shoulder: 0,
        combined: 0,
      },
      left: {
        knee: 0,
        elbow: 0,
        ankle: 0,
        hip: 0,
        shoulder: 0,
        combined: 0,
      },
    },
    scores: {
      right: 0,
      left: 0,
    },
    visibility: {
      right: 0,
      left: 0,
    },
    view: '',
  };

  const joints = Object.keys(raw[0].right.visibility);
  const sum = (a: any, b: any) => a + b;
  const mapVis = (side: any, curr: any) => (joint: any) => curr[side].visibility[joint];
  const computeVisbility = (acc: any, curr: any) => {
    acc.visibility.right += joints.map(mapVis('right', curr)).reduce(sum, 0) / output.raw.joints;
    acc.visibility.left += joints.map(mapVis('left', curr)).reduce(sum, 0) / output.raw.joints;
    return acc;
  };

  raw.reduce(computeVisbility, output);

  output.visibility.left = output.visibility.left / output.raw.frames;
  output.visibility.right = output.visibility.right / output.raw.frames;

  const calculateview = () => {
    if (output.visibility.right > 0.8 && output.visibility.left > 0.8) {
      return 'center';
    }
    const side = output.visibility.right > output.visibility.left ? 'right' : 'left';

    return side;
  };
  output.view = calculateview();

  const computeTotalMaximumMinimum = (acc: any, curr: any) => {
    acc.total.right.knee += curr.right.angles.knee;
    acc.total.right.elbow += curr.right.angles.elbow;
    acc.total.right.ankle += curr.right.angles.ankle;
    acc.total.right.hip += curr.right.angles.hip;
    acc.total.right.shoulder += curr.right.angles.shoulder;
    acc.maximum.right.knee = Math.max(acc.maximum.right.knee, curr.right.angles.knee);
    acc.maximum.right.elbow = Math.max(acc.maximum.right.elbow, curr.right.angles.elbow);
    acc.maximum.right.ankle = Math.max(acc.maximum.right.ankle, curr.right.angles.ankle);
    acc.maximum.right.hip = Math.max(acc.maximum.right.hip, curr.right.angles.hip);
    acc.maximum.right.shoulder = Math.max(acc.maximum.right.shoulder, curr.right.angles.shoulder);
    acc.minimum.right.knee = Math.min(acc.minimum.right.knee, curr.right.angles.knee);
    acc.minimum.right.elbow = Math.min(acc.minimum.right.elbow, curr.right.angles.elbow);
    acc.minimum.right.ankle = Math.min(acc.minimum.right.ankle, curr.right.angles.ankle);
    acc.minimum.right.hip = Math.min(acc.minimum.right.hip, curr.right.angles.hip);
    acc.minimum.right.shoulder = Math.min(acc.minimum.right.shoulder, curr.right.angles.shoulder);

    acc.total.left.knee += curr.left.angles.knee;
    acc.total.left.elbow += curr.left.angles.elbow;
    acc.total.left.ankle += curr.left.angles.ankle;
    acc.total.left.hip += curr.left.angles.hip;
    acc.total.left.shoulder += curr.left.angles.shoulder;
    acc.maximum.left.knee = Math.max(acc.maximum.left.knee, curr.left.angles.knee);
    acc.maximum.left.elbow = Math.max(acc.maximum.left.elbow, curr.left.angles.elbow);
    acc.maximum.left.ankle = Math.max(acc.maximum.left.ankle, curr.left.angles.ankle);
    acc.maximum.left.hip = Math.max(acc.maximum.left.hip, curr.left.angles.hip);
    acc.maximum.left.shoulder = Math.max(acc.maximum.left.shoulder, curr.left.angles.shoulder);
    acc.minimum.left.knee = Math.min(acc.minimum.left.knee, curr.left.angles.knee);
    acc.minimum.left.elbow = Math.min(acc.minimum.left.elbow, curr.left.angles.elbow);
    acc.minimum.left.ankle = Math.min(acc.minimum.left.ankle, curr.left.angles.ankle);
    acc.minimum.left.hip = Math.min(acc.minimum.left.hip, curr.left.angles.hip);
    acc.minimum.left.shoulder = Math.min(acc.minimum.left.shoulder, curr.left.angles.shoulder);
    return acc;
  };

  raw.reduce(computeTotalMaximumMinimum, output);

  const computeaverage = () => {
    output.average.right.knee = output.total.right.knee / output.raw.frames;
    output.average.right.elbow = output.total.right.elbow / output.raw.frames;
    output.average.right.ankle = output.total.right.ankle / output.raw.frames;
    output.average.right.hip = output.total.right.hip / output.raw.frames;
    output.average.right.shoulder = output.total.right.shoulder / output.raw.frames;
    output.average.right.combined =
      (output.total.right.knee +
        output.total.right.shoulder +
        output.total.right.elbow +
        output.total.right.hip +
        output.total.right.ankle) /
      (output.raw.frames * output.raw.joints);

    output.average.left.knee = output.total.left.knee / output.raw.frames;
    output.average.left.elbow = output.total.left.elbow / output.raw.frames;
    output.average.left.ankle = output.total.left.ankle / output.raw.frames;
    output.average.left.hip = output.total.left.hip / output.raw.frames;
    output.average.left.shoulder = output.total.left.shoulder / output.raw.frames;
    output.average.left.combined =
      (output.total.left.knee +
        output.total.left.shoulder +
        output.total.left.elbow +
        output.total.left.hip +
        output.total.left.ankle) /
      (output.raw.frames * output.raw.joints);
  };

  computeaverage();

  const computeScore = () => {
    output.scores.right = Math.floor((output.average.right.combined / 180) * 100);
    output.scores.left = Math.floor((output.average.left.combined / 180) * 100);
  };

  computeScore();

  return output;
};
