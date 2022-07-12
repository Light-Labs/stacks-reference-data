export function to_byte_array_string(data: Uint8Array)
{
	return `{ ${Array.from(data).map(v => '0x'+v.toString(16).padStart(2, '0')).join(', ')} }`;
}

export function print_byte_array(data: Uint8Array)
{
	console.log(to_byte_array_string(data));
}