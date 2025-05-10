import { Map } from "./_components/Map";

export default function ClientGamePage({ params }: { params: { mapId: string } }) {
  return (
    <>
      <Map />
      <div> {params.mapId}</div>
    </>
  );
}
