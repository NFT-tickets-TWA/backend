create or replace function check_if_registration_opened() returns trigger as
$$
begin
    if exists(select * from "Event" where id = NEW."eventID") then
        if exists(select * from "Event" where id = NEW."eventID" and status = 'REGISTRATION_OPENED') then
            return new;
        else
            raise EXCEPTION 'registration must be opened if you want to register';
        end if;
    else
        raise EXCEPTION 'there is no event with this id';
    end if;
end
$$
    language "plpgsql";

create or replace function check_before_approve()
    returns trigger as
$$
begin
    if OLD.status = 'REGISTERED' then
        return NEW;
    else
        return null;
    end if;
end;
$$
    language 'plpgsql';

create or replace function check_before_received_nft()
    returns trigger as
$$
begin
    if OLD.status = 'APPROVED' then
        return NEW;
    else
        return null;
    end if;
end;
$$
    language 'plpgsql';
create or replace function event_update_at()
    returns trigger as
$$
begin
    new."updatedAt" = 'now()';
    RETURN NEW;
end;
$$
    language 'plpgsql';
CREATE OR REPLACE FUNCTION check_before_create_location()
    RETURNS TRIGGER AS
$$
BEGIN
    IF new."isOffline" = true THEN
        IF new.link IS NULL AND new.address IS NOT NULL THEN
            RETURN NEW;
        ELSE
            RAISE EXCEPTION 'If event is offline, link must be null and address must be not null';
        END IF;
    ELSE
        IF new.address IS NULL AND new.link IS NOT NULL THEN
            RETURN NEW;
        ELSE
            RAISE EXCEPTION 'If event is not offline, link must be not null and address must not null';
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER check_before_create_location_trigger
    BEFORE INSERT OR UPDATE
    ON "Location"
    FOR EACH ROW
EXECUTE FUNCTION check_before_create_location();

create
    or replace trigger check_approved
    before
        update
    on "ParticipantList"
    for each row
execute function
    check_before_approve();
create
    or replace trigger event_update_at
    before
        update
    on "Event"
    for each row
execute function
    event_update_at();

create
    or replace trigger check_received_aft
    before
        update
    on "ParticipantList"
    for each row
execute function
    check_before_received_nft();
create
    or replace trigger check_is_registration_opened
    before
        insert
    on "ParticipantList"
    for each row
execute function
    check_if_registration_opened();
-- This is an empty migration.